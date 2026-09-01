import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type ProductInput = {
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

const toProductCreateData = (data: ProductInput, companyId: string) => ({
  name: data.name,
  sku: data.sku,
  quantity: data.quantity,
  status: data.status,
  value: data.value,
  companyId,
});

const toProductUpdateData = (data: Partial<ProductInput>) => ({
  name: data.name,
  sku: data.sku,
  quantity: data.quantity,
  status: data.status,
  value: data.value,
});

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async findAll(user: AuthenticatedUser) {
    const companyId = requireTenant(user);

    return this.prisma.product.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const companyId = requireTenant(user);
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
    });

    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }

    return product;
  }

  async create(user: AuthenticatedUser, data: ProductInput) {
    const companyId = requireTenant(user);

    const product = await this.prisma.product.create({
      data: toProductCreateData(data, companyId),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "stock",
      action: "create",
      entityType: "Product",
      entityId: product.id,
      newValue: product,
    });

    return product;
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<ProductInput>) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const product = await this.prisma.product.update({
      where: { id },
      data: toProductUpdateData(data),
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "stock",
      action: "update",
      entityType: "Product",
      entityId: product.id,
      oldValue: existing,
      newValue: product,
    });

    return product;
  }

  async remove(user: AuthenticatedUser, id: string) {
    const existing = await this.findOne(user, id);
    const companyId = requireTenant(user);

    const product = await this.prisma.product.delete({
      where: { id },
    });

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "stock",
      action: "delete",
      entityType: "Product",
      entityId: id,
      oldValue: existing,
    });

    return product;
  }
}
