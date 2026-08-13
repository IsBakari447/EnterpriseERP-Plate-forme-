import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/auth/public.decorator";
import { AppService } from "./app.service";

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return this.appService.getRoot();
  }

  @Get("health")
  getHealth() {
    return this.appService.getHealth();
  }

  @Get("health/ready")
  getReadiness() {
    return this.appService.getReadiness();
  }

  @Get("modules")
  getModules() {
    return this.appService.getModules();
  }

  @Get("pricing")
  getPricing() {
    return this.appService.getPricing();
  }

  @Get("roadmap")
  getRoadmap() {
    return this.appService.getRoadmap();
  }

  @Get("security")
  getSecurity() {
    return this.appService.getSecurity();
  }

  @Get("integrations")
  getIntegrations() {
    return this.appService.getIntegrations();
  }

  @Get("onboarding")
  getOnboarding() {
    return this.appService.getOnboarding();
  }

  @Get("competitive-position")
  getCompetitivePosition() {
    return this.appService.getCompetitivePosition();
  }

  @Get("demo-script")
  getDemoScript() {
    return this.appService.getDemoScript();
  }

  @Get("roi-model")
  getRoiModel() {
    return this.appService.getRoiModel();
  }

  @Get("faq")
  getFaq() {
    return this.appService.getFaq();
  }

  @Get("platform-status")
  getPlatformStatus() {
    return this.appService.getPlatformStatus();
  }

  @Get("login")
  getLogin() {
    return this.appService.getLoginHelp();
  }

  @Get("register")
  getRegister() {
    return this.appService.getRegisterHelp();
  }

  @Get("dashboard")
  getDashboard() {
    return this.appService.getDashboardHelp();
  }
}
