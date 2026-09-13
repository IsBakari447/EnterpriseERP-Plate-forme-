import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import { EducationRecordDto } from "./dto/education-record.dto";
import { type EducationResource, EducationService } from "./education.service";

@Controller("education")
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get(":resource")
  @Permissions("education.read")
  findAll(@CurrentUser() user: AuthenticatedUser, @Param("resource") resource: EducationResource) {
    return this.educationService.findAll(user, resource);
  }

  @Get(":resource/:id")
  @Permissions("education.read")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("resource") resource: EducationResource, @Param("id") id: string) {
    return this.educationService.findOne(user, resource, id);
  }

  @Post(":resource")
  @Permissions("education.manage")
  create(@CurrentUser() user: AuthenticatedUser, @Param("resource") resource: EducationResource, @Body() body: EducationRecordDto) {
    return this.educationService.create(user, resource, body as Record<string, unknown>);
  }

  @Put(":resource/:id")
  @Permissions("education.manage")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resource") resource: EducationResource,
    @Param("id") id: string,
    @Body() body: EducationRecordDto
  ) {
    return this.educationService.update(user, resource, id, body as Record<string, unknown>);
  }

  @Delete(":resource/:id")
  @Permissions("education.manage")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("resource") resource: EducationResource, @Param("id") id: string) {
    return this.educationService.remove(user, resource, id);
  }
}
