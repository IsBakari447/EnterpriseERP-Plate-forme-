import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
  findAll() {
    return this.crmService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.crmService.findOne(id);
  }

  @Post()
  create(@Body() body: ClientInput) {
    return this.crmService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: Partial<ClientInput>) {
    return this.crmService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.crmService.remove(id);
  }
}
