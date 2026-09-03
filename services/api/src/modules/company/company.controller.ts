import { Body, Controller, Get, Patch, Post, Put } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import { CompanyService } from "./company.service";

type UpdateCompanyInput = {
  name?: string;
  sector?: string;
  businessType?: string | null;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  numberFormat?: string;
  enabledModules?: string[];
  onboardingCompleted?: boolean;
};

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @Permissions("company.read")
  getCurrentCompany(@CurrentUser() user: AuthenticatedUser) {
    return this.companyService.getCurrentCompany(user);
  }

  @Get("current")
  @Permissions("company.read")
  getCurrentCompanyAlias(@CurrentUser() user: AuthenticatedUser) {
    return this.companyService.getCurrentCompany(user);
  }

  @Put()
  @Permissions("company.update")
  updateCurrentCompany(@CurrentUser() user: AuthenticatedUser, @Body() body: UpdateCompanyInput) {
    return this.companyService.updateCurrentCompany(user, body);
  }

  @Patch()
  @Permissions("company.update")
  patchCurrentCompany(@CurrentUser() user: AuthenticatedUser, @Body() body: UpdateCompanyInput) {
    return this.companyService.updateCurrentCompany(user, body);
  }

  @Patch("current")
  @Permissions("company.update")
  patchCurrentCompanyAlias(@CurrentUser() user: AuthenticatedUser, @Body() body: UpdateCompanyInput) {
    return this.companyService.updateCurrentCompany(user, body);
  }

  @Get("current/modules")
  @Permissions("company.read")
  getCurrentModules(@CurrentUser() user: AuthenticatedUser) {
    return this.companyService.getCurrentModules(user);
  }

  @Patch("current/modules")
  @Permissions("company.update")
  updateCurrentModules(@CurrentUser() user: AuthenticatedUser, @Body() body: { enabledModules?: string[] }) {
    return this.companyService.updateCurrentModules(user, body.enabledModules ?? []);
  }

  @Post("current/complete-onboarding")
  @Permissions("company.update")
  completeOnboarding(@CurrentUser() user: AuthenticatedUser) {
    return this.companyService.completeOnboarding(user);
  }
}
