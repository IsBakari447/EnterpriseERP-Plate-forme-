import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserRole, UserStatus } from "@prisma/client";
import { AuthenticatedUser, CurrentUser } from "../../common/auth/current-user.decorator";
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
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findAll(user);
  }

  @Get("roles")
  @Permissions("users.read")
  roles() {
    return this.usersService.getRoleMatrix();
  }

  @Get(":id")
  @Permissions("users.read")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.usersService.findOne(user, id);
  }

  @Post()
  @Permissions("users.update")
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateUserBody) {
    return this.usersService.create(user, body);
  }

  @Post("invite")
  @Permissions("users.invite")
  invite(@CurrentUser() user: AuthenticatedUser, @Body() body: InviteUserBody) {
    return this.usersService.invite(user, body);
  }

  @Put(":id")
  @Permissions("users.update")
  update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: Partial<CreateUserBody>) {
    return this.usersService.update(user, id, body);
  }

  @Delete(":id")
  @Permissions("users.update")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.usersService.remove(user, id);
  }
}
