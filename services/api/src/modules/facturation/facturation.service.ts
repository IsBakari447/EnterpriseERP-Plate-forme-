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

  private async getCompanyId() {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return company?.id;
  }

  async findAll() {
    const companyId = await this.getCompanyId();

    return this.prisma.invoice.findMany({
      where: companyId ? { companyId } : undefined,
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

  async create(data: InvoiceInput) {
    const companyId = await this.getCompanyId();

    return this.prisma.invoice.create({
      data: {
        ...data,
        companyId,
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
