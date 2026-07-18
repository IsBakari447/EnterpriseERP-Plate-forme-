import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
  findAll() {
    return this.stockService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stockService.findOne(id);
  }

  @Post()
  create(@Body() body: ProductInput) {
    return this.stockService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: Partial<ProductInput>) {
    return this.stockService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stockService.remove(id);
  }
}
