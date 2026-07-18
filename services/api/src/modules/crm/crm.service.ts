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

  findAll() {
    return this.prisma.client.findMany({
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

  create(data: ClientInput) {
    return this.prisma.client.create({
      data: {
        ...data,
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
