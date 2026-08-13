import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { PrismaService } from "../../prisma.service";
import { AuditService } from "../audit/audit.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "../auth/jwt.service";
import { PasswordService } from "../auth/password.service";
import { I18nModule } from "../i18n/i18n.module";
import { PermissionsGuard } from "../security/permissions.guard";

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
    JwtService,
    PasswordService,
    AuditService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PrismaService, JwtService, PasswordService, AuditService, I18nModule],
})
export class CoreModule {}
