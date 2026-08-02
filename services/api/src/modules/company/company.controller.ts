import { Body, Controller, Get, Put } from "@nestjs/common";
import { Permissions } from "../../common/security/permissions.decorator";
import { CompanyService } from "./company.service";

type UpdateCompanyInput = {
  name?: string;
  sector?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  currency?: string;
  language?: string;
  timezone?: string;
};

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @Permissions("company.read")
  getCurrentCompany() {
    return this.companyService.getCurrentCompany();
  }

  @Put()
  @Permissions("company.update")
  updateCurrentCompany(@Body() body: UpdateCompanyInput) {
    return this.companyService.updateCurrentCompany(body);
  }
}
