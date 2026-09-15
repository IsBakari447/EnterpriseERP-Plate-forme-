import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash, randomBytes, randomInt } from "crypto";
import { Prisma, UserRole } from "@prisma/client";
import nodemailer from "nodemailer";
import { JwtService } from "../../common/auth/jwt.service";
import { PasswordService } from "../../common/auth/password.service";
import { AuditService } from "../../common/audit/audit.service";
import { rolePermissions } from "../../common/security/permissions";
import { PrismaService } from "../../prisma.service";

type RegisterInput = {
  companyName: string;
  name: string;
  email: string;
  password: string;
  sector?: string;
  language?: string;
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceName?: string;
};

type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

type PasswordResetEntry = {
  codeHash: string;
  expiresAt: number;
  attempts: number;
};

@Injectable()
export class AuthService {
  private readonly loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>();
  private readonly passwordResetCodes = new Map<string, PasswordResetEntry>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly password: PasswordService,
    private readonly audit: AuditService
  ) {}

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private createSecureToken() {
    return randomBytes(32).toString("base64url");
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException("Le mot de passe doit contenir au moins 8 caracteres");
    }
  }

  private createResetCode() {
    return String(randomInt(0, 1_000_000)).padStart(6, "0");
  }

  private getAppUrl() {
    return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  }

  private hasSmtpConfig() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.EMAIL_FROM);
  }

  private assertVerificationDeliveryConfigured() {
    if (process.env.NODE_ENV === "production" && !this.hasSmtpConfig()) {
      throw new HttpException("Email verification is not configured.", HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private buildEmailVerificationUrl(token: string) {
    return `${this.getAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  }

  private async deliverVerificationEmail(email: string, verificationUrl: string) {
    if (!this.hasSmtpConfig()) return false;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE ?? "").toLowerCase() === "true",
      auth: process.env.SMTP_USERNAME
        ? {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your EnterpriseERP Cloud email",
      text: [
        "Welcome to EnterpriseERP Cloud.",
        "",
        "Verify your email address to activate your workspace:",
        verificationUrl,
        "",
        "This link expires in 24 hours.",
      ].join("\n"),
      html: `
        <p>Welcome to <strong>EnterpriseERP Cloud</strong>.</p>
        <p>Verify your email address to activate your workspace:</p>
        <p><a href="${verificationUrl}">Verify my email</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    return true;
  }

  private async createEmailVerificationToken(userId: string) {
    const token = this.createSecureToken();
    const tokenHash = this.hashToken(token);

    await this.prisma.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return token;
  }

  private async sendEmailVerification(user: { id: string; email: string; companyId: string | null }, meta: RequestMeta) {
    const token = await this.createEmailVerificationToken(user.id);
    const verificationUrl = this.buildEmailVerificationUrl(token);
    const delivered = await this.deliverVerificationEmail(user.email, verificationUrl);

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "email_verification_sent",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
      newValue: {
        email: user.email,
        delivered,
        verificationUrl: process.env.NODE_ENV === "production" ? undefined : verificationUrl,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      return { verificationToken: token, verificationUrl };
    }

    return {};
  }

  private getLoginRateKey(email: string, meta: RequestMeta) {
    return `${meta.ipAddress ?? "unknown"}:${email}`;
  }

  private assertLoginAllowed(key: string) {
    const now = Date.now();
    const attempt = this.loginAttempts.get(key);

    if (!attempt) return;

    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      throw new HttpException("Trop de tentatives. Reessayez dans quelques minutes.", HttpStatus.TOO_MANY_REQUESTS);
    }

    if (attempt.resetAt <= now) {
      this.loginAttempts.delete(key);
    }
  }

  private recordFailedLogin(key: string) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 8;
    const attempt = this.loginAttempts.get(key);
    const nextAttempt = attempt && attempt.resetAt > now ? attempt : { count: 0, resetAt: now + windowMs };
    nextAttempt.count += 1;

    if (nextAttempt.count >= maxAttempts) {
      nextAttempt.lockedUntil = now + windowMs;
    }

    this.loginAttempts.set(key, nextAttempt);
  }

  private resetFailedLogin(key: string) {
    this.loginAttempts.delete(key);
  }

  private splitName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const firstName = parts.shift() ?? name.trim();
    const lastName = parts.join(" ") || null;

    return { firstName, lastName };
  }

  private async createTokenResponse(user: {
    id: string;
    email: string;
    companyId: string | null;
    role: UserRole;
  }, input: { rememberMe?: boolean; deviceName?: string }, meta: RequestMeta) {
    const session = await this.prisma.userSession.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        deviceName: input.deviceName,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        rememberMe: input.rememberMe ?? false,
        expiresAt: new Date(Date.now() + this.jwt.getRefreshTokenLifetimeMs()),
      },
    });
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
      sessionId: session.id,
    };
    const accessToken = this.jwt.createAccessToken(tokenPayload);
    const refreshToken = this.jwt.createRefreshToken(tokenPayload);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: this.hashToken(refreshToken),
      },
    });

    const currentUser = await this.me(user.id);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
      companyId: currentUser.companyId,
      sector: currentUser.company?.sector ?? null,
      onboardingCompleted: currentUser.company?.onboardingCompleted ?? false,
      role: currentUser.role,
      permissions: rolePermissions[currentUser.role] ?? [],
      user: currentUser,
    };
  }

  async register(input: RegisterInput, meta: RequestMeta) {
    if (!input.companyName || !input.name || !input.email) {
      throw new BadRequestException("Entreprise, nom et email sont obligatoires");
    }

    this.validatePassword(input.password);
    this.assertVerificationDeliveryConfigured();
    const email = this.normalizeEmail(input.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new BadRequestException("Un compte existe deja avec cet email");
    }

    try {
      const { company, user } = await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            name: input.companyName,
            sector: input.sector ?? "general",
            language: input.language ?? "fr",
          },
        });
        const ownerRole = await tx.role.create({
          data: {
            companyId: company.id,
            key: "OWNER",
            name: "Owner",
            description: "Full company owner access",
            system: true,
          },
        });
        const ownerPermissions = await tx.permission.findMany({
          where: {
            key: {
              in: rolePermissions.OWNER,
            },
          },
          select: { id: true },
        });
        if (ownerPermissions.length > 0) {
          await tx.rolePermission.createMany({
            data: ownerPermissions.map((permission) => ({
              roleId: ownerRole.id,
              permissionId: permission.id,
            })),
            skipDuplicates: true,
          });
        }
        const user = await tx.user.create({
          data: {
            companyId: company.id,
            name: input.name,
            ...this.splitName(input.name),
            email,
            passwordHash: this.password.hash(input.password),
            language: input.language ?? "fr",
            role: "OWNER",
            status: "ACTIVE",
            emailVerifiedAt: null,
          },
        });
        await tx.membership.create({
          data: {
            companyId: company.id,
            userId: user.id,
            roleId: ownerRole.id,
            legacyRole: "OWNER",
            status: "ACTIVE",
          },
        });

        return { company, user };
      });

      await this.audit.record({
        companyId: company.id,
        userId: user.id,
        module: "auth",
        action: "register",
        entityType: "User",
        entityId: user.id,
        ipAddress: meta.ipAddress,
        newValue: {
          company: company.name,
          email: user.email,
          role: user.role,
        },
      });

      const verification = await this.sendEmailVerification(user, meta);

      return {
        requiresEmailVerification: true,
        message: "Compte cree. Verifiez votre adresse e-mail pour activer l'acces.",
        email: user.email,
        ...verification,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("Un compte existe deja avec cet email");
      }

      throw error;
    }
  }

  async login(input: LoginInput, meta: RequestMeta) {
    const email = this.normalizeEmail(input.email ?? "");
    const rateKey = this.getLoginRateKey(email, meta);

    this.assertLoginAllowed(rateKey);

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !this.password.verify(input.password, user.passwordHash)) {
      this.recordFailedLogin(rateKey);
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException("Compte non actif");
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException("Adresse e-mail non verifiee. Verifiez votre boite mail.");
    }

    this.resetFailedLogin(rateKey);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "login",
      entityType: "UserSession",
      ipAddress: meta.ipAddress,
    });

    return this.createTokenResponse(user, input, meta);
  }

  async verifyEmail(token: string, meta: RequestMeta) {
    const tokenHash = this.hashToken(String(token ?? "").trim());
    const entry = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!entry || entry.usedAt || entry.expiresAt < new Date()) {
      throw new BadRequestException("Le lien de verification est invalide ou expire.");
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: entry.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: entry.userId },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);

    await this.audit.record({
      companyId: entry.user.companyId ?? undefined,
      userId: entry.userId,
      module: "auth",
      action: "email_verified",
      entityType: "User",
      entityId: entry.userId,
      ipAddress: meta.ipAddress,
    });

    return { message: "Adresse e-mail verifiee. Vous pouvez maintenant vous connecter." };
  }

  async resendVerification(emailInput: string, meta: RequestMeta) {
    const email = this.normalizeEmail(emailInput ?? "");
    const genericMessage = "Si le compte existe et n'est pas verifie, un nouveau lien a ete envoye.";

    if (!email) return { message: genericMessage };

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, companyId: true, emailVerifiedAt: true },
    });

    if (!user || user.emailVerifiedAt) {
      return { message: genericMessage };
    }

    const recentToken = await this.prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentToken) {
      return { message: genericMessage };
    }

    const verification = await this.sendEmailVerification(user, meta);
    return {
      message: genericMessage,
      ...verification,
    };
  }

  async refresh(refreshToken: string, meta: RequestMeta) {
    const payload = this.jwt.verify(refreshToken, "refresh");
    const session = await this.prisma.userSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Session expiree");
    }

    if (session.refreshTokenHash !== this.hashToken(refreshToken)) {
      throw new UnauthorizedException("Refresh token invalide");
    }

    const accessToken = this.jwt.createAccessToken({
      sub: session.user.id,
      email: session.user.email,
      companyId: session.user.companyId,
      role: session.user.role,
      sessionId: session.id,
    });
    const nextRefreshToken = this.jwt.createRefreshToken({
      sub: session.user.id,
      email: session.user.email,
      companyId: session.user.companyId,
      role: session.user.role,
      sessionId: session.id,
    });

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: this.hashToken(nextRefreshToken),
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    const currentUser = await this.me(session.user.id);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
      companyId: currentUser.companyId,
      sector: currentUser.company?.sector ?? null,
      onboardingCompleted: currentUser.company?.onboardingCompleted ?? false,
      role: currentUser.role,
      permissions: rolePermissions[currentUser.role] ?? [],
      user: currentUser,
    };
  }

  async logout(sessionId: string) {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
        refreshTokenHash: null,
      },
    });

    return { success: true };
  }

  async forgotPassword(input: { email?: string }, meta: RequestMeta) {
    const email = this.normalizeEmail(input.email ?? "");

    if (email) {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, companyId: true, email: true },
      });

      if (user) {
        const code = this.createResetCode();
        this.passwordResetCodes.set(email, {
          codeHash: this.hashToken(code),
          expiresAt: Date.now() + 15 * 60 * 1000,
          attempts: 0,
        });

        await this.audit.record({
          companyId: user.companyId ?? undefined,
          userId: user.id,
          module: "auth",
          action: "password_reset_requested",
          entityType: "User",
          entityId: user.id,
          ipAddress: meta.ipAddress,
        });

        if (process.env.NODE_ENV !== "production") {
          return {
            message: "Un code de verification a ete envoye si le compte existe.",
            resetCode: code,
          };
        }
      }
    }

    return { message: "Un code de verification a ete envoye si le compte existe." };
  }

  async resetPassword(input: { email?: string; code?: string; password?: string; confirmPassword?: string }, meta: RequestMeta) {
    const email = this.normalizeEmail(input.email ?? "");
    const code = String(input.code ?? "").trim();
    const entry = this.passwordResetCodes.get(email);

    if (!email || !code || !entry || entry.expiresAt < Date.now()) {
      throw new BadRequestException("Le code est invalide ou expire.");
    }

    if (entry.attempts >= 5) {
      this.passwordResetCodes.delete(email);
      throw new BadRequestException("Le code est invalide ou expire.");
    }

    entry.attempts += 1;

    if (entry.codeHash !== this.hashToken(code)) {
      throw new BadRequestException("Le code est invalide ou expire.");
    }

    if (input.password !== input.confirmPassword) {
      throw new BadRequestException("Les mots de passe ne correspondent pas.");
    }

    this.validatePassword(input.password ?? "");

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, companyId: true },
    });

    if (!user) {
      throw new BadRequestException("Le code est invalide ou expire.");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: this.password.hash(input.password ?? ""),
        passwordChangedAt: new Date(),
      },
    });
    await this.prisma.userSession.updateMany({
      where: { userId: user.id },
      data: {
        revokedAt: new Date(),
        refreshTokenHash: null,
      },
    });
    this.passwordResetCodes.delete(email);

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "password_reset_completed",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return { message: "Mot de passe mis a jour avec succes." };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        companyId: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        jobTitle: true,
        department: true,
        avatarUrl: true,
        language: true,
        timezone: true,
        theme: true,
        displayCurrency: true,
        notificationEmail: true,
        notificationErp: true,
        notificationImportant: true,
        role: true,
        status: true,
        lastLoginAt: true,
        passwordChangedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            sector: true,
            businessType: true,
            enabledModules: true,
            language: true,
            currency: true,
            country: true,
            timezone: true,
            dateFormat: true,
            numberFormat: true,
            onboardingCompleted: true,
            onboardingCompletedAt: true,
          },
        },
        memberships: {
          select: {
            companyId: true,
            legacyRole: true,
            status: true,
            role: {
              select: {
                id: true,
                key: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Utilisateur introuvable");
    }

    return user;
  }
}
