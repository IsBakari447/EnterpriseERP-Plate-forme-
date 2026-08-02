import { Injectable, NotFoundException } from "@nestjs/common";
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

  private async getCompanyId() {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return company?.id;
  }

  async findAll() {
    const companyId = await this.getCompanyId();

    return this.prisma.product.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }

    return product;
  }

  async create(data: ProductInput) {
    const companyId = await this.getCompanyId();

    return this.prisma.product.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(id: string, data: Partial<ProductInput>) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
