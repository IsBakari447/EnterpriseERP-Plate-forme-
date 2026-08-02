import { Injectable, NotFoundException } from "@nestjs/common";
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

  private async getCompanyId() {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return company?.id;
  }

  async findAll() {
    const companyId = await this.getCompanyId();

    return this.prisma.client.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    return client;
  }

  async create(data: ClientInput) {
    const companyId = await this.getCompanyId();

    return this.prisma.client.create({
      data: {
        ...data,
        companyId,
        revenue: data.revenue ?? 0,
      },
    });
  }

  async update(id: string, data: Partial<ClientInput>) {
    await this.findOne(id);

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
