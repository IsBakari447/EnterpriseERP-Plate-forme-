import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole, UserStatus } from "@prisma/client";
import { AuditService } from "../../common/audit/audit.service";
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

  private async getCompanyId() {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!company) {
      const created = await this.prisma.company.create({
        data: {
          name: "EnterpriseERP Demo",
          sector: "general",
          country: "Suede",
          currency: "EUR",
          language: "fr",
          timezone: "Europe/Stockholm",
        },
      });

      return created.id;
    }

    return company.id;
  }

  async findAll() {
    const companyId = await this.getCompanyId();

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

  async findOne(id: string) {
    const companyId = await this.getCompanyId();
    const user = await this.prisma.user.findFirst({
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

    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    return user;
  }

  async create(data: CreateUserInput) {
    if (!data.name || !data.email) {
      throw new BadRequestException("Le nom et l'email sont obligatoires");
    }

    const companyId = await this.getCompanyId();
    const user = await this.prisma.user.create({
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
      entityId: user.id,
      newValue: user,
    });

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const existing = await this.findOne(id);
    const companyId = await this.getCompanyId();
    const user = await this.prisma.user.update({
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
      entityId: user.id,
      oldValue: existing,
      newValue: user,
    });

    return user;
  }

  async invite(data: InviteUserInput) {
    if (!data.email) {
      throw new BadRequestException("L'email est obligatoire");
    }

    const companyId = await this.getCompanyId();
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

  async remove(id: string) {
    const existing = await this.findOne(id);
    const companyId = await this.getCompanyId();
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
