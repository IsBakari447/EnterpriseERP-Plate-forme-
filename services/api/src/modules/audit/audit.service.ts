import { Injectable } from "@nestjs/common";
import { AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type AuditQuery = {
  userId?: string;
  module?: string;
  action?: string;
  result?: string;
  from?: string;
  to?: string;
};

const companyAuditRoles = new Set(["SUPER_ADMIN", "OWNER", "ADMINISTRATOR"]);

@Injectable()
export class AuditModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(user: AuthenticatedUser) {
    const scope = this.getScope(user);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [actionsToday, logins, loginFailures, sensitiveActions, securityAlerts] = await Promise.all([
      this.prisma.auditLog.count({ where: { ...scope, createdAt: { gte: today } } }),
      this.prisma.auditLog.count({ where: { ...scope, action: { in: ["login", "LOGIN_SUCCESS"] } } }),
      this.prisma.auditLog.count({ where: { ...scope, action: { in: ["LOGIN_FAILED"] } } }),
      this.prisma.auditLog.count({ where: { ...scope, action: { in: ["ROLE_CHANGED", "PERMISSION_CHANGED", "EXPORT_CREATED", "PASSWORD_CHANGED"] } } }),
      this.prisma.auditLog.count({ where: { ...scope, result: { in: ["warning", "failed"] } } }),
    ]);

    return {
      actionsToday,
      logins,
      loginFailures,
      sensitiveActions,
      securityAlerts,
    };
  }

  async list(user: AuthenticatedUser, query: AuditQuery) {
    const where = {
      ...this.getScope(user),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.module ? { module: query.module } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.result ? { result: query.result } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        companyId: true,
        userId: true,
        action: true,
        module: true,
        entityType: true,
        entityId: true,
        ipAddress: true,
        userAgent: true,
        result: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  private getScope(user: AuthenticatedUser) {
    if (companyAuditRoles.has(user.role) && user.companyId) {
      return { companyId: user.companyId };
    }

    return { userId: user.sub };
  }
}
