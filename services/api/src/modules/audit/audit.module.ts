import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AuditController } from "./audit.controller";
import { AuditModuleService } from "./audit.service";

@Module({
  controllers: [AuditController],
  providers: [AuditModuleService, PrismaService],
})
export class AuditModule {}
