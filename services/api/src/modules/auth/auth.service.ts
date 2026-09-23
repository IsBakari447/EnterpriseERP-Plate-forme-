import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt } from "crypto";
import { Prisma, UserRole } from "@prisma/client";
import nodemailer from "nodemailer";
import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";
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
  termsAccepted: boolean;
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

type MfaChallengeInput = {
  challengeId: string;
  code?: string;
  recoveryCode?: string;
};

type MfaDisableInput = {
  password: string;
  code?: string;
  recoveryCode?: string;
};

const LEGAL_TERMS_VERSION = "2026-09-22";
const LEGAL_PRIVACY_VERSION = "2026-09-22";

@Injectable()
export class AuthService {
  private readonly loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>();

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

  private getMfaEncryptionKeys() {
    const dedicatedSecret = process.env.MFA_ENCRYPTION_KEY;

    if (!dedicatedSecret && process.env.NODE_ENV === "production") {
      throw new Error("MFA_ENCRYPTION_KEY is required in production.");
    }

    const legacySecret = process.env.JWT_SECRET ?? "enterpriseerp-local-secret";
    const secrets = [dedicatedSecret, legacySecret].filter((secret): secret is string => Boolean(secret));

    return [...new Set(secrets)].map((secret) => createHash("sha256").update(secret).digest());
  }

  private encryptSecret(secret: string) {
    const iv = randomBytes(12);
    const [key] = this.getMfaEncryptionKeys();
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
  }

  private decryptSecret(value: string) {
    const [ivRaw, tagRaw, encryptedRaw] = value.split(".");
    if (!ivRaw || !tagRaw || !encryptedRaw) throw new BadRequestException("Invalid MFA configuration.");

    for (const key of this.getMfaEncryptionKeys()) {
      try {
        const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivRaw, "base64url"));
        decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));

        return Buffer.concat([decipher.update(Buffer.from(encryptedRaw, "base64url")), decipher.final()]).toString("utf8");
      } catch {
        continue;
      }
    }

    throw new BadRequestException("Invalid MFA configuration.");
  }

  private isPrivilegedMfaRole(role: UserRole) {
    return role === "OWNER" || role === "ADMINISTRATOR" || role === "SUPER_ADMIN";
  }

  private verifyTotp(code: string | undefined, encryptedSecret: string | null | undefined) {
    if (!code || !encryptedSecret) return false;
    return verifySync({
      secret: this.decryptSecret(encryptedSecret),
      token: code.trim(),
      epochTolerance: 30,
    }).valid;
  }

  private createRecoveryCodes() {
    return Array.from({ length: 10 }, () => `${randomBytes(4).toString("hex")}-${randomBytes(4).toString("hex")}`);
  }

  private hashRecoveryCodes(codes: string[]) {
    return codes.map((code) => this.hashToken(code.trim().toLowerCase()));
  }

  private async consumeRecoveryCode(userId: string, recoveryCode: string | undefined, recoveryCodesHash: unknown) {
    if (!recoveryCode || !Array.isArray(recoveryCodesHash)) return false;
    const codeHash = this.hashToken(recoveryCode.trim().toLowerCase());
    const hashes = recoveryCodesHash.filter((item): item is string => typeof item === "string");

    if (!hashes.includes(codeHash)) return false;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaRecoveryCodes: hashes.filter((hash) => hash !== codeHash),
      },
    });

    return true;
  }

  private async verifyMfaCredential(user: { id: string; mfaSecretEnc: string | null; mfaRecoveryCodes: unknown }, input: { code?: string; recoveryCode?: string }) {
    if (this.verifyTotp(input.code, user.mfaSecretEnc)) return true;
    return this.consumeRecoveryCode(user.id, input.recoveryCode, user.mfaRecoveryCodes);
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException("Password must contain at least 8 characters.");
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

  private isEmailVerificationRequired() {
    const configured = String(process.env.EMAIL_VERIFICATION_REQUIRED ?? "").toLowerCase();
    if (["true", "1", "yes"].includes(configured)) return true;
    if (["false", "0", "no"].includes(configured)) return false;
    return this.hasSmtpConfig();
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

  private async deliverPasswordResetEmail(email: string, code: string) {
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
      subject: "Reset your EnterpriseERP Cloud password",
      text: [
        "EnterpriseERP Cloud password reset",
        "",
        `Your verification code is: ${code}`,
        "",
        "This code expires in 15 minutes.",
        "If you did not request this reset, you can ignore this email.",
      ].join("\n"),
      html: `
        <p><strong>EnterpriseERP Cloud password reset</strong></p>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${code}</p>
        <p>This code expires in 15 minutes.</p>
        <p>If you did not request this reset, you can ignore this email.</p>
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
      throw new HttpException("Too many attempts. Try again in a few minutes.", HttpStatus.TOO_MANY_REQUESTS);
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

  private async createMfaChallenge(user: { id: string; email: string; companyId: string | null; role: UserRole }, input: LoginInput, meta: RequestMeta) {
    const challenge = await this.prisma.mfaChallenge.create({
      data: {
        userId: user.id,
        rememberMe: input.rememberMe ?? false,
        deviceName: input.deviceName,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "mfa_challenge_created",
      entityType: "MfaChallenge",
      entityId: challenge.id,
      ipAddress: meta.ipAddress,
    });

    return {
      mfaRequired: true,
      challengeId: challenge.id,
      expiresIn: 300,
      message: "MFA code required.",
    };
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
      throw new BadRequestException("Company, name and email are required.");
    }

    if (input.termsAccepted !== true) {
      throw new BadRequestException("Terms and privacy policy acceptance is required.");
    }

    this.validatePassword(input.password);
    const verificationRequired = this.isEmailVerificationRequired();
    const email = this.normalizeEmail(input.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new BadRequestException("An account already exists with this email.");
    }

    try {
      const { company, user } = await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            name: input.companyName,
            sector: input.sector ?? "general",
            language: input.language ?? "en",
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
            language: input.language ?? "en",
            role: "OWNER",
            status: "ACTIVE",
            emailVerifiedAt: verificationRequired ? null : new Date(),
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
          termsAccepted: true,
          termsVersion: LEGAL_TERMS_VERSION,
          privacyVersion: LEGAL_PRIVACY_VERSION,
        },
      });

      if (!verificationRequired) {
        await this.audit.record({
          companyId: company.id,
          userId: user.id,
          module: "auth",
          action: "email_verification_skipped",
          entityType: "User",
          entityId: user.id,
          ipAddress: meta.ipAddress,
          newValue: {
            reason: "smtp_not_configured",
            email: user.email,
          },
        });

        return this.createTokenResponse(user, { rememberMe: true, deviceName: "EnterpriseERP Web" }, meta);
      }

      const verification = await this.sendEmailVerification(user, meta);
      return {
        requiresEmailVerification: true,
        message: "Account created. Verify your email address to activate access.",
        email: user.email,
        ...verification,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("An account already exists with this email.");
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
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException("Account is not active.");
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException("Email address is not verified. Check your inbox.");
    }

    this.resetFailedLogin(rateKey);

    if (user.mfaEnabled && this.isPrivilegedMfaRole(user.role)) {
      return this.createMfaChallenge(user, input, meta);
    }

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

  async setupMfa(userId: string, password: string, meta: RequestMeta) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !this.password.verify(password, user.passwordHash)) {
      throw new UnauthorizedException("Incorrect password.");
    }

    if (!this.isPrivilegedMfaRole(user.role)) {
      throw new BadRequestException("MFA is currently reserved for administrator accounts.");
    }

    const secret = generateSecret();
    const issuer = "EnterpriseERP Cloud";
    const label = user.email;
    const otpauthUrl = generateURI({ issuer, label, secret });
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaTempSecretEnc: this.encryptSecret(secret),
        mfaTempSecretExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "mfa_setup_started",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return {
      issuer,
      label,
      otpauthUrl,
      qrCodeDataUrl,
      expiresIn: 600,
    };
  }

  async verifyMfaSetup(userId: string, code: string, meta: RequestMeta) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mfaTempSecretEnc || !user.mfaTempSecretExpiresAt || user.mfaTempSecretExpiresAt < new Date()) {
      throw new BadRequestException("MFA setup has expired. Start setup again.");
    }

    if (!this.verifyTotp(code, user.mfaTempSecretEnc)) {
      throw new BadRequestException("Invalid MFA code.");
    }

    const recoveryCodes = this.createRecoveryCodes();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
        mfaSecretEnc: user.mfaTempSecretEnc,
        mfaTempSecretEnc: null,
        mfaTempSecretExpiresAt: null,
        mfaRecoveryCodes: this.hashRecoveryCodes(recoveryCodes),
        mfaEnabledAt: new Date(),
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "mfa_enabled",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return {
      message: "MFA enabled.",
      recoveryCodes,
    };
  }

  async completeMfaChallenge(input: MfaChallengeInput, meta: RequestMeta) {
    const challenge = await this.prisma.mfaChallenge.findUnique({
      where: { id: input.challengeId },
      include: { user: true },
    });

    if (!challenge || challenge.usedAt || challenge.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired MFA challenge.");
    }

    const ok = await this.verifyMfaCredential(challenge.user, input);
    if (!ok) {
      await this.audit.record({
        companyId: challenge.user.companyId ?? undefined,
        userId: challenge.user.id,
        module: "auth",
        action: "mfa_challenge_failed",
        entityType: "MfaChallenge",
        entityId: challenge.id,
        ipAddress: meta.ipAddress,
        result: "failure",
      });
      throw new UnauthorizedException("Invalid MFA code.");
    }

    await this.prisma.mfaChallenge.update({
      where: { id: challenge.id },
      data: { usedAt: new Date() },
    });
    await this.prisma.user.update({
      where: { id: challenge.user.id },
      data: { lastLoginAt: new Date() },
    });
    await this.audit.record({
      companyId: challenge.user.companyId ?? undefined,
      userId: challenge.user.id,
      module: "auth",
      action: "mfa_challenge_completed",
      entityType: "MfaChallenge",
      entityId: challenge.id,
      ipAddress: meta.ipAddress,
    });

    return this.createTokenResponse(
      challenge.user,
      { rememberMe: challenge.rememberMe, deviceName: challenge.deviceName ?? undefined },
      { ipAddress: challenge.ipAddress ?? meta.ipAddress, userAgent: challenge.userAgent ?? meta.userAgent }
    );
  }

  async disableMfa(userId: string, input: MfaDisableInput, meta: RequestMeta) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !this.password.verify(input.password, user.passwordHash)) {
      throw new UnauthorizedException("Incorrect password.");
    }

    if (!user.mfaEnabled) {
      return { message: "MFA is already disabled." };
    }

    const ok = await this.verifyMfaCredential(user, input);
    if (!ok) throw new UnauthorizedException("Invalid MFA code.");

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecretEnc: null,
        mfaTempSecretEnc: null,
        mfaTempSecretExpiresAt: null,
        mfaRecoveryCodes: Prisma.JsonNull,
        mfaEnabledAt: null,
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "mfa_disabled",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return { message: "MFA disabled." };
  }

  async regenerateMfaRecoveryCodes(userId: string, code: string, meta: RequestMeta) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mfaEnabled || !this.verifyTotp(code, user.mfaSecretEnc)) {
      throw new UnauthorizedException("Invalid MFA code.");
    }

    const recoveryCodes = this.createRecoveryCodes();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { mfaRecoveryCodes: this.hashRecoveryCodes(recoveryCodes) },
    });
    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "mfa_recovery_regenerated",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return { recoveryCodes };
  }

  async verifyEmail(token: string, meta: RequestMeta) {
    const tokenHash = this.hashToken(String(token ?? "").trim());
    const entry = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!entry || entry.usedAt || entry.expiresAt < new Date()) {
      throw new BadRequestException("The verification link is invalid or expired.");
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

    return { message: "Email address verified. You can now sign in." };
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
      throw new UnauthorizedException("Session expired.");
    }

    if (session.refreshTokenHash !== this.hashToken(refreshToken)) {
      throw new UnauthorizedException("Invalid refresh token.");
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

        await this.prisma.$transaction([
          this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() },
          }),
          this.prisma.passwordResetToken.create({
            data: {
              userId: user.id,
              codeHash: this.hashToken(code),
              expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
          }),
        ]);

        let delivered = false;
        try {
          delivered = await this.deliverPasswordResetEmail(user.email, code);
        } catch {
          delivered = false;
        }

        await this.audit.record({
          companyId: user.companyId ?? undefined,
          userId: user.id,
          module: "auth",
          action: "password_reset_requested",
          entityType: "User",
          entityId: user.id,
          ipAddress: meta.ipAddress,
          newValue: {
            email: user.email,
            delivered,
          },
        });

        if (process.env.NODE_ENV !== "production") {
          return {
            message: "A verification code has been sent if the account exists.",
            resetCode: code,
          };
        }
      }
    }

    return { message: "A verification code has been sent if the account exists." };
  }

  async resetPassword(input: { email?: string; code?: string; password?: string; confirmPassword?: string }, meta: RequestMeta) {
    const email = this.normalizeEmail(input.email ?? "");
    const code = String(input.code ?? "").trim();

    if (!email || !code) {
      throw new BadRequestException("The code is invalid or expired.");
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, companyId: true },
    });

    if (!user) {
      throw new BadRequestException("The code is invalid or expired.");
    }

    const entry = await this.prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!entry || entry.expiresAt < new Date()) {
      if (entry) {
        await this.prisma.passwordResetToken.update({
          where: { id: entry.id },
          data: { usedAt: new Date() },
        });
      }
      throw new BadRequestException("The code is invalid or expired.");
    }

    if (entry.attempts >= 5) {
      await this.prisma.passwordResetToken.update({
        where: { id: entry.id },
        data: { usedAt: new Date() },
      });
      throw new BadRequestException("The code is invalid or expired.");
    }

    const nextAttempts = entry.attempts + 1;

    if (entry.codeHash !== this.hashToken(code)) {
      await this.prisma.passwordResetToken.update({
        where: { id: entry.id },
        data: { attempts: nextAttempts },
      });
      throw new BadRequestException("The code is invalid or expired.");
    }

    if (input.password !== input.confirmPassword) {
      throw new BadRequestException("Passwords do not match.");
    }

    this.validatePassword(input.password ?? "");

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.update({
        where: { id: entry.id },
        data: { attempts: nextAttempts, usedAt: new Date() },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null, id: { not: entry.id } },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: this.password.hash(input.password ?? ""),
          passwordChangedAt: new Date(),
        },
      }),
      this.prisma.userSession.updateMany({
        where: { userId: user.id },
        data: {
          revokedAt: new Date(),
          refreshTokenHash: null,
        },
      }),
    ]);

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.id,
      module: "auth",
      action: "password_reset_completed",
      entityType: "User",
      entityId: user.id,
      ipAddress: meta.ipAddress,
    });

    return { message: "Password updated successfully." };
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
        mfaEnabled: true,
        mfaEnabledAt: true,
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
      throw new UnauthorizedException("User not found.");
    }

    return user;
  }
}
