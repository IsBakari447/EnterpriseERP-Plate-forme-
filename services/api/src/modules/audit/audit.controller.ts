import { Controller, Get, Query } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { AuditModuleService } from "./audit.service";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditModuleService) {}

  @Get("summary")
  summary(@CurrentUser() user: AuthenticatedUser) {
    return this.auditService.getSummary(user);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: Record<string, string | undefined>) {
    return this.auditService.list(user, query);
  }
}
