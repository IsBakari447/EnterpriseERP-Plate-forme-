import { Controller, Get } from "@nestjs/common";
import { Public } from "../../common/auth/public.decorator";
import { PlatformService } from "./platform.service";

@Public()
@Controller("platform")
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get("foundation")
  foundation() {
    return this.platformService.getSaasFoundation();
  }

  @Get("modules")
  modules() {
    return this.platformService.getModules();
  }

  @Get("sectors")
  sectors() {
    return this.platformService.getSectors();
  }

  @Get("roles")
  roles() {
    return this.platformService.getRoles();
  }

  @Get("permissions")
  permissions() {
    return this.platformService.getPermissions();
  }

  @Get("workflows")
  workflows() {
    return this.platformService.getWorkflows();
  }

  @Get("roadmap")
  roadmap() {
    return this.platformService.getRoadmap();
  }
}
