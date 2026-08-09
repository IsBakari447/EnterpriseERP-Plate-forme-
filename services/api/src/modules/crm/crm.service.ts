import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type ClientInput = {
  name: string;
  email: string;
  country: string;
  status: string;
  revenue?: number;
};

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.client.create({
      data: {
        ...data,
        companyId,
        revenue: data.revenue ?? 0,
      },
    });
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<ClientInput>) {
    await this.findOne(user, id);

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.findOne(user, id);

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
