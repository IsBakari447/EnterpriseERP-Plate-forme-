import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import { StockService } from "./stock.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Controller("products")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions("stock.read")
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.stockService.findAll(user);
  }

  @Get(":id")
  @Permissions("stock.read")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.stockService.findOne(user, id);
  }

  @Post()
  @Permissions("stock.adjust")
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateProductDto) {
    return this.stockService.create(user, body);
  }

  @Put(":id")
  @Permissions("stock.adjust")
  update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateProductDto) {
    return this.stockService.update(user, id, body);
  }

  @Delete(":id")
  @Permissions("stock.adjust")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.stockService.remove(user, id);
  }
}
