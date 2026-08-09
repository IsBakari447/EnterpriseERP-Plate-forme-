import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
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
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.facturationService.findAll(user);
  }

  @Get(":id")
  @Permissions("invoice.read")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.facturationService.findOne(user, id);
  }

  @Post()
  @Permissions("invoice.create")
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: InvoiceInput) {
    return this.facturationService.create(user, body);
  }

  @Put(":id")
  @Permissions("invoice.create")
  update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: Partial<InvoiceInput>) {
    return this.facturationService.update(user, id, body);
  }

  @Delete(":id")
  @Permissions("invoice.cancel")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.facturationService.remove(user, id);
  }
}
