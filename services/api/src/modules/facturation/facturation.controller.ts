import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Permissions } from "../../common/security/permissions.decorator";
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
  @Permissions("invoice.read")
  findAll() {
    return this.facturationService.findAll();
  }

  @Get(":id")
  @Permissions("invoice.read")
  findOne(@Param("id") id: string) {
    return this.facturationService.findOne(id);
  }

  @Post()
  @Permissions("invoice.create")
  create(@Body() body: InvoiceInput) {
    return this.facturationService.create(body);
  }

  @Put(":id")
  @Permissions("invoice.create")
  update(@Param("id") id: string, @Body() body: Partial<InvoiceInput>) {
    return this.facturationService.update(id, body);
  }

  @Delete(":id")
  @Permissions("invoice.cancel")
  remove(@Param("id") id: string) {
    return this.facturationService.remove(id);
  }
}
