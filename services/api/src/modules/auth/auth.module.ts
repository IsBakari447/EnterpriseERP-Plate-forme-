import { Module } from "@nestjs/common";
import { JwtService } from "../../common/auth/jwt.service";
import { PasswordService } from "../../common/auth/password.service";
import { AuditService } from "../../common/audit/audit.service";
import { PrismaService } from "../../prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordService, PrismaService, AuditService],
  exports: [AuthService, JwtService, PasswordService],
})
export class AuthModule {}
