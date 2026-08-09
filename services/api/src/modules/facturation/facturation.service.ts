import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
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

  async findAll(user: AuthenticatedUser) {
    const companyId = requireTenant(user);

    return this.prisma.invoice.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const companyId = requireTenant(user);
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
    });

    if (!invoice) {
      throw new NotFoundException("Facture introuvable");
    }

    return invoice;
  }

  async create(user: AuthenticatedUser, data: InvoiceInput) {
    const companyId = requireTenant(user);

    return this.prisma.invoice.create({
      data: {
        ...data,
        companyId,
        amount: data.amount ?? 0,
        due: new Date(data.due),
      },
    });
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<InvoiceInput>) {
    await this.findOne(user, id);

    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...data,
        due: data.due ? new Date(data.due) : undefined,
      },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.findOne(user, id);

    return this.prisma.invoice.delete({ where: { id } });
  }
}
