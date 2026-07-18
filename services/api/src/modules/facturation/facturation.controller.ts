import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { FacturationService } from "./facturation.service";

type InvoiceInput = {
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

@Controller("invoices")
export class FacturationController {
  constructor(private readonly facturationService: FacturationService) {}

  @Get()
  findAll() {
    return this.facturationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.facturationService.findOne(id);
  }

  @Post()
  create(@Body() body: InvoiceInput) {
    return this.facturationService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: Partial<InvoiceInput>) {
    return this.facturationService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.facturationService.remove(id);
  }
}
