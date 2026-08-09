import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type ProductInput = {
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.product.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(user: AuthenticatedUser, id: string, data: Partial<ProductInput>) {
    await this.findOne(user, id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.findOne(user, id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
