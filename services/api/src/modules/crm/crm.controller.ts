import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
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
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.crmService.findAll(user);
  }

  @Get(":id")
  @Permissions("crm.read")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.crmService.findOne(user, id);
  }

  @Post()
  @Permissions("crm.create")
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: ClientInput) {
    return this.crmService.create(user, body);
  }

  @Put(":id")
  @Permissions("crm.update")
  update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: Partial<ClientInput>) {
    return this.crmService.update(user, id, body);
  }

  @Delete(":id")
  @Permissions("crm.delete")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.crmService.remove(user, id);
  }
}
