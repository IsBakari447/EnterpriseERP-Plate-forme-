import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { CrmModule } from "./modules/crm/crm.module";
import { StockModule } from "./modules/stock/stock.module";
import { FacturationModule } from "./modules/facturation/facturation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CrmModule,
    StockModule,
    FacturationModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
