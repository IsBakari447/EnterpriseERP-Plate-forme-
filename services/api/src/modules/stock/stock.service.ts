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

  findAll() {
    return this.prisma.product.findMany({
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

  create(data: ProductInput) {
    return this.prisma.product.create({ data });
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
