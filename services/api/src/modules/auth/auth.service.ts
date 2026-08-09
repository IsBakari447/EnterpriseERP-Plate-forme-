import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash } from "crypto";
import { UserRole } from "@prisma/client";
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly password: PasswordService,
    private readonly audit: AuditService
  ) {}

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException("Le mot de passe doit contenir au moins 8 caracteres");
    }
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

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
      user: await this.me(user.id),
    };
  }

  async register(input: RegisterInput, meta: RequestMeta) {
    if (!input.companyName || !input.name || !input.email) {
      throw new BadRequestException("Entreprise, nom et email sont obligatoires");
    }

    this.validatePassword(input.password);
    const email = this.normalizeEmail(input.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new BadRequestException("Un compte existe deja avec cet email");
    }

    const company = await this.prisma.company.create({
      data: {
        name: input.companyName,
        sector: input.sector ?? "general",
        language: input.language ?? "fr",
      },
    });
    const ownerRole = await this.prisma.role.create({
      data: {
        companyId: company.id,
        key: "OWNER",
        name: "Owner",
        description: "Full company owner access",
        system: true,
      },
    });
    const ownerPermissions = await this.prisma.permission.findMany({
      where: {
        key: {
          in: rolePermissions.OWNER,
        },
      },
      select: { id: true },
    });
    if (ownerPermissions.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: ownerPermissions.map((permission) => ({
          roleId: ownerRole.id,
          permissionId: permission.id,
        })),
        skipDuplicates: true,
      });
    }
    const user = await this.prisma.user.create({
      data: {
        companyId: company.id,
        name: input.name,
        email,
        passwordHash: this.password.hash(input.password),
        role: "OWNER",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
      },
    });
    await this.prisma.membership.create({
      data: {
        companyId: company.id,
        userId: user.id,
        roleId: ownerRole.id,
        legacyRole: "OWNER",
        status: "ACTIVE",
      },
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

    return this.createTokenResponse(user, { rememberMe: true, deviceName: "Initial registration" }, meta);
  }

  async login(input: LoginInput, meta: RequestMeta) {
    const email = this.normalizeEmail(input.email ?? "");
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !this.password.verify(input.password, user.passwordHash)) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException("Compte non actif");
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

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
      user: await this.me(session.user.id),
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

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        companyId: true,
        name: true,
        email: true,
        role: true,
        status: true,
        company: {
          select: {
            id: true,
            name: true,
            sector: true,
            enabledModules: true,
            language: true,
            currency: true,
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
