import { Module } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { PasswordService } from "../../common/auth/password.service";
import { PrismaService } from "../../prisma.service";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, PasswordService, AuditService],
})
export class ProfileModule {}
