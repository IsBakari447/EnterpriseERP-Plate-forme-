import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

type AuditInput = {
  companyId?: string;
  userId?: string;
  module: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  result?: string;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          companyId: input.companyId,
          userId: input.userId,
          module: input.module,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          oldValue: input.oldValue === undefined ? undefined : JSON.parse(JSON.stringify(input.oldValue)),
          newValue: input.newValue === undefined ? undefined : JSON.parse(JSON.stringify(input.newValue)),
          ipAddress: input.ipAddress,
          result: input.result ?? "success",
        },
      });
    } catch (error) {
      this.logger.warn(`Audit unavailable for ${input.module}.${input.action}`);
      return null;
    }
  }
}
