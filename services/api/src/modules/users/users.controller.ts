import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserRole, UserStatus } from "@prisma/client";
import { Permissions } from "../../common/security/permissions.decorator";
import { UsersService } from "./users.service";

type CreateUserBody = {
  name: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
};

type InviteUserBody = {
  email: string;
  role?: UserRole;
};

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions("users.read")
  findAll() {
    return this.usersService.findAll();
  }

  @Get("roles")
  @Permissions("users.read")
  roles() {
    return this.usersService.getRoleMatrix();
  }

  @Get(":id")
  @Permissions("users.read")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions("users.update")
  create(@Body() body: CreateUserBody) {
    return this.usersService.create(body);
  }

  @Post("invite")
  @Permissions("users.invite")
  invite(@Body() body: InviteUserBody) {
    return this.usersService.invite(body);
  }

  @Put(":id")
  @Permissions("users.update")
  update(@Param("id") id: string, @Body() body: Partial<CreateUserBody>) {
    return this.usersService.update(id, body);
  }

  @Delete(":id")
  @Permissions("users.update")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
