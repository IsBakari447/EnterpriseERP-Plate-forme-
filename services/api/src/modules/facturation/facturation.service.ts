import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

type InvoiceInput = {
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

@Injectable()
export class FacturationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new NotFoundException("Facture introuvable");
    }

    return invoice;
  }

  create(data: InvoiceInput) {
    return this.prisma.invoice.create({
      data: {
        ...data,
        amount: data.amount ?? 0,
        due: new Date(data.due),
      },
    });
  }

  async update(id: string, data: Partial<InvoiceInput>) {
    await this.findOne(id);
    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...data,
        due: data.due ? new Date(data.due) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.invoice.delete({ where: { id } });
  }
}
