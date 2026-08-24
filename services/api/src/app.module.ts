import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CrmModule } from "./modules/crm/crm.module";
import { StockModule } from "./modules/stock/stock.module";
import { FacturationModule } from "./modules/facturation/facturation.module";
import { CompanyModule } from "./modules/company/company.module";
import { PlatformModule } from "./modules/platform/platform.module";
import { UsersModule } from "./modules/users/users.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { AuditModule } from "./modules/audit/audit.module";
import { CoreModule } from "./common/core/core.module";
import { OperationsModule } from "./modules/operations/operations.module";
import { EducationModule } from "./modules/education/education.module";

@Module({
  imports: [
    CoreModule,
    AuthModule,
    CompanyModule,
    CrmModule,
    StockModule,
    FacturationModule,
    PlatformModule,
    UsersModule,
    ProfileModule,
    AuditModule,
    OperationsModule,
    EducationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
