import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Permissions } from "../../common/security/permissions.decorator";
import { CrmService } from "./crm.service";

type ClientInput = {
  name: string;
  email: string;
  country: string;
  status: string;
  revenue?: number;
};

@Controller("clients")
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  @Permissions("crm.read")
  findAll() {
    return this.crmService.findAll();
  }

  @Get(":id")
  @Permissions("crm.read")
  findOne(@Param("id") id: string) {
    return this.crmService.findOne(id);
  }

  @Post()
  @Permissions("crm.create")
  create(@Body() body: ClientInput) {
    return this.crmService.create(body);
  }

  @Put(":id")
  @Permissions("crm.update")
  update(@Param("id") id: string, @Body() body: Partial<ClientInput>) {
    return this.crmService.update(id, body);
  }

  @Delete(":id")
  @Permissions("crm.delete")
  remove(@Param("id") id: string) {
    return this.crmService.remove(id);
  }
}
