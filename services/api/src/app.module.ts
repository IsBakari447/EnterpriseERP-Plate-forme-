import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/auth/auth.guard";
import { JwtService } from "./common/auth/jwt.service";
import { PermissionsGuard } from "./common/security/permissions.guard";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CrmModule } from "./modules/crm/crm.module";
import { StockModule } from "./modules/stock/stock.module";
import { FacturationModule } from "./modules/facturation/facturation.module";
import { CompanyModule } from "./modules/company/company.module";
import { PlatformModule } from "./modules/platform/platform.module";
import { UsersModule } from "./modules/users/users.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { AuditModule } from "./modules/audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CompanyModule,
    CrmModule,
    StockModule,
    FacturationModule,
    PlatformModule,
    UsersModule,
    ProfileModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
