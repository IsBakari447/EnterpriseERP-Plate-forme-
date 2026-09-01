import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type ClientInput = {
  name: string;
  email: string;
  country: string;
  status: string;
  revenue?: number;
};

const toClientCreateData = (data: ClientInput, companyId: string) => ({
  name: data.name,
  email: data.email,
  country: data.country,
  status: data.status,
  revenue: data.revenue ?? 0,
  companyId,
});

const toClientUpdateData = (data: Partial<ClientInput>) => ({
  name: data.name,
  email: data.email,
  country: data.country,
  status: data.status,
  revenue: data.revenue,
});

@Injectable()
export class CrmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async findAll(user: AuthenticatedUser) {
    const companyId = requireTenant(user);

    return this.prisma.client.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const companyId = requireTenant(user);
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    return client;
  }

  async create(user: AuthenticatedUser, data: ClientInput) {
    const companyId = requireTenant(user);

    const client = await this.prisma.client.create({
      data: toClientCreateData(data, companyId),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "crm",
      action: "create",
      entityType: "Client",
      entityId: client.id,
      newValue: client,
    });

    return client;
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<ClientInput>) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const client = await this.prisma.client.update({
      where: { id },
      data: toClientUpdateData(data),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "crm",
      action: "update",
      entityType: "Client",
      entityId: client.id,
      oldValue: existing,
      newValue: client,
    });

    return client;
  }

  async remove(user: AuthenticatedUser, id: string) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const client = await this.prisma.client.delete({
      where: { id },
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "crm",
      action: "delete",
      entityType: "Client",
      entityId: id,
      oldValue: existing,
    });

    return client;
  }
}
