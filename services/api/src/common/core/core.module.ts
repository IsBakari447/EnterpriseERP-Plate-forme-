import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { PrismaService } from "../../prisma.service";
import { AiService } from "../ai/ai.service";
import { AuditService } from "../audit/audit.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "../auth/jwt.service";
import { PasswordService } from "../auth/password.service";
import { I18nModule } from "../i18n/i18n.module";
import { RateLimitGuard } from "../rate-limit/rate-limit.guard";
import { RateLimitService } from "../rate-limit/rate-limit.service";
import { PermissionsGuard } from "../security/permissions.guard";
import { TenantGuard } from "../tenant/tenant.guard";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule,
  ],
  providers: [
    PrismaService,
    AiService,
    JwtService,
    PasswordService,
    AuditService,
    RateLimitService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PrismaService, AiService, JwtService, PasswordService, AuditService, RateLimitService, I18nModule],
})
export class CoreModule {}
