import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Permissions } from "../../common/security/permissions.decorator";
import { StockService } from "./stock.service";

type ProductInput = {
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

@Controller("products")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions("stock.read")
  findAll() {
    return this.stockService.findAll();
  }

  @Get(":id")
  @Permissions("stock.read")
  findOne(@Param("id") id: string) {
    return this.stockService.findOne(id);
  }

  @Post()
  @Permissions("stock.adjust")
  create(@Body() body: ProductInput) {
    return this.stockService.create(body);
  }

  @Put(":id")
  @Permissions("stock.adjust")
  update(@Param("id") id: string, @Body() body: Partial<ProductInput>) {
    return this.stockService.update(id, body);
  }

  @Delete(":id")
  @Permissions("stock.adjust")
  remove(@Param("id") id: string) {
    return this.stockService.remove(id);
  }
}
