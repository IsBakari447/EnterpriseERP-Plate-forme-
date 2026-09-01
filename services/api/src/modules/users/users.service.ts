import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole, UserStatus } from "@prisma/client";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { rolePermissions } from "../../common/security/permissions";
import { PrismaService } from "../../prisma.service";

type CreateUserInput = {
  name: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
};

type UpdateUserInput = Partial<CreateUserInput>;

type InviteUserInput = {
  email: string;
  role?: UserRole;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async findAll(user: AuthenticatedUser) {
    const companyId = requireTenant(user);

    return this.prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(currentUser: AuthenticatedUser, id: string) {
    const companyId = requireTenant(currentUser);
    const foundUser = await this.prisma.user.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    return foundUser;
  }

  async create(currentUser: AuthenticatedUser, data: CreateUserInput) {
    if (!data.name || !data.email) {
      throw new BadRequestException("Le nom et l'email sont obligatoires");
    }

    const companyId = requireTenant(currentUser);
    const createdUser = await this.prisma.user.create({
      data: {
        companyId,
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role ?? "EMPLOYEE",
        status: data.status ?? "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    await this.audit.record({
      companyId,
      module: "users",
      action: "create",
      entityType: "User",
      entityId: createdUser.id,
      newValue: createdUser,
    });

    return createdUser;
  }

  async update(currentUser: AuthenticatedUser, id: string, data: UpdateUserInput) {
    const existing = await this.findOne(currentUser, id);
    const companyId = requireTenant(currentUser);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email?.toLowerCase(),
        role: data.role,
        status: data.status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    await this.audit.record({
      companyId,
      module: "users",
      action: "update",
      entityType: "User",
      entityId: updatedUser.id,
      oldValue: existing,
      newValue: updatedUser,
    });

    return updatedUser;
  }

  async invite(currentUser: AuthenticatedUser, data: InviteUserInput) {
    if (!data.email) {
      throw new BadRequestException("L'email est obligatoire");
    }

    const companyId = requireTenant(currentUser);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invitation = await this.prisma.invitation.create({
      data: {
        companyId,
        email: data.email.toLowerCase(),
        role: data.role ?? "EMPLOYEE",
        expiresAt,
      },
    });

    await this.audit.record({
      companyId,
      module: "users",
      action: "invite",
      entityType: "Invitation",
      entityId: invitation.id,
      newValue: {
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });

    return invitation;
  }

  async remove(currentUser: AuthenticatedUser, id: string) {
    const existing = await this.findOne(currentUser, id);
    const companyId = requireTenant(currentUser);
    const deleted = await this.prisma.user.delete({ where: { id } });

    await this.audit.record({
      companyId,
      module: "users",
      action: "delete",
      entityType: "User",
      entityId: id,
      oldValue: existing,
    });

    return deleted;
  }

  getRoleMatrix() {
    return Object.entries(rolePermissions).map(([role, permissions]) => ({
      role,
      permissions,
    }));
  }
}
