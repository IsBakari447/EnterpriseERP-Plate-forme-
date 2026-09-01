import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type InvoiceInput = {
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

const toInvoiceCreateData = (data: InvoiceInput, companyId: string) => ({
  number: data.number,
  customer: data.customer,
  amount: data.amount ?? 0,
  due: new Date(data.due),
  status: data.status,
  companyId,
});

const toInvoiceUpdateData = (data: Partial<InvoiceInput>) => ({
  number: data.number,
  customer: data.customer,
  amount: data.amount,
  due: data.due ? new Date(data.due) : undefined,
  status: data.status,
});

@Injectable()
export class FacturationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

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

    const invoice = await this.prisma.invoice.create({
      data: toInvoiceCreateData(data, companyId),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "facturation",
      action: "create",
      entityType: "Invoice",
      entityId: invoice.id,
      newValue: invoice,
    });

    return invoice;
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<InvoiceInput>) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: toInvoiceUpdateData(data),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "facturation",
      action: "update",
      entityType: "Invoice",
      entityId: invoice.id,
      oldValue: existing,
      newValue: invoice,
    });

    return invoice;
  }

  async remove(user: AuthenticatedUser, id: string) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const invoice = await this.prisma.invoice.delete({ where: { id } });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "facturation",
      action: "delete",
      entityType: "Invoice",
      entityId: id,
      oldValue: existing,
    });

    return invoice;
  }
}
