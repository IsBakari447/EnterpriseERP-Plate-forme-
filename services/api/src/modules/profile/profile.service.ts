import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { PasswordService } from "../../common/auth/password.service";
import { PrismaService } from "../../prisma.service";

type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  language?: string;
  timezone?: string;
  theme?: string;
  displayCurrency?: string;
  notificationEmail?: boolean;
  notificationErp?: boolean;
  notificationImportant?: boolean;
  signature?: string;
};

type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly audit: AuditService
  ) {}

  async getProfile(user: AuthenticatedUser) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.sub },
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
        signature: true,
        role: true,
        status: true,
        lastLoginAt: true,
        passwordChangedAt: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            sector: true,
            currency: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Profil introuvable");
    }

    return profile;
  }

  async updateProfile(user: AuthenticatedUser, input: UpdateProfileInput, meta: RequestMeta) {
    const before = await this.getProfile(user);
    const firstName = input.firstName?.trim() || before.firstName;
    const lastName = input.lastName?.trim() || before.lastName;
    const name = [firstName, lastName].filter(Boolean).join(" ") || before.name;

    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        name,
        phone: input.phone,
        jobTitle: input.jobTitle,
        department: input.department,
        language: input.language,
        timezone: input.timezone,
        theme: input.theme,
        displayCurrency: input.displayCurrency,
        notificationEmail: input.notificationEmail,
        notificationErp: input.notificationErp,
        notificationImportant: input.notificationImportant,
        signature: input.signature,
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "profile",
      action: "USER_UPDATED",
      entityType: "User",
      entityId: user.sub,
      before,
      after: {
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        jobTitle: updated.jobTitle,
        department: updated.department,
        language: updated.language,
        timezone: updated.timezone,
        theme: updated.theme,
      },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return this.getProfile(user);
  }

  async updateAvatar(user: AuthenticatedUser, avatarUrl: string, meta: RequestMeta) {
    const isExternalUrl = /^https?:\/\//i.test(avatarUrl ?? "");
    const isInlineImage = /^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=]+$/i.test(avatarUrl ?? "");

    if (!isExternalUrl && !isInlineImage) {
      throw new BadRequestException("avatarUrl doit etre une URL HTTPS ou une image locale valide");
    }

    if (isInlineImage && avatarUrl.length > 120_000) {
      throw new BadRequestException("La photo de profil est trop volumineuse");
    }

    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data: { avatarUrl },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "profile",
      action: "AVATAR_UPDATED",
      entityType: "User",
      entityId: user.sub,
      after: { avatarUrl: updated.avatarUrl },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { avatarUrl: updated.avatarUrl };
  }

  async deleteAvatar(user: AuthenticatedUser, meta: RequestMeta) {
    await this.prisma.user.update({
      where: { id: user.sub },
      data: { avatarUrl: null },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "profile",
      action: "AVATAR_DELETED",
      entityType: "User",
      entityId: user.sub,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { avatarUrl: null };
  }

  async updatePassword(user: AuthenticatedUser, input: UpdatePasswordInput, meta: RequestMeta) {
    if (!input.newPassword || input.newPassword.length < 8) {
      throw new BadRequestException("Le nouveau mot de passe doit contenir au moins 8 caracteres");
    }

    const current = await this.prisma.user.findUnique({ where: { id: user.sub } });

    if (!current || !this.password.verify(input.currentPassword, current.passwordHash)) {
      throw new UnauthorizedException("Mot de passe actuel incorrect");
    }

    await this.prisma.user.update({
      where: { id: user.sub },
      data: {
        passwordHash: this.password.hash(input.newPassword),
        passwordChangedAt: new Date(),
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "security",
      action: "PASSWORD_CHANGED",
      entityType: "User",
      entityId: user.sub,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true };
  }

  async getSessions(user: AuthenticatedUser) {
    return this.prisma.userSession.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        rememberMe: true,
        revokedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    });
  }

  async revokeSession(user: AuthenticatedUser, sessionId: string, meta: RequestMeta) {
    await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId: user.sub },
      data: {
        revokedAt: new Date(),
        refreshTokenHash: null,
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "security",
      action: "SESSION_REVOKED",
      entityType: "UserSession",
      entityId: sessionId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true };
  }

  async logoutAll(user: AuthenticatedUser, meta: RequestMeta) {
    await this.prisma.userSession.updateMany({
      where: { userId: user.sub, revokedAt: null },
      data: {
        revokedAt: new Date(),
        refreshTokenHash: null,
      },
    });

    await this.audit.record({
      companyId: user.companyId ?? undefined,
      userId: user.sub,
      module: "security",
      action: "LOGOUT_ALL",
      entityType: "UserSession",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true };
  }
}
