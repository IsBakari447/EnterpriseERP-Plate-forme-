import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma.service";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { EnterprisePermission, EnterpriseRole, rolePermissions } from "./permissions";

type RequestWithUser = {
  user?: {
    sub?: string;
    companyId?: string | null;
    role?: EnterpriseRole;
    permissions?: EnterprisePermission[];
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<EnterprisePermission[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.role || !user.sub) {
      throw new UnauthorizedException("Authentication required");
    }

    const explicitPermissions = user.permissions ?? [];
    const inheritedPermissions = rolePermissions[user.role] ?? [];
    const databasePermissions = await this.loadDatabasePermissions(user.sub, user.companyId);
    const effectivePermissions = new Set([
      ...inheritedPermissions,
      ...explicitPermissions,
      ...databasePermissions,
    ]);

    const allowed = requiredPermissions.every((permission) => effectivePermissions.has(permission));

    if (!allowed) {
      throw new ForbiddenException("Insufficient permission");
    }

    return true;
  }

  private async loadDatabasePermissions(userId: string, companyId?: string | null): Promise<EnterprisePermission[]> {
    if (!companyId) {
      return [];
    }

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        companyId,
        status: "ACTIVE",
      },
      select: {
        role: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: {
                    key: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return (
      membership?.role?.permissions
        .map((item) => item.permission.key)
        .filter((key): key is EnterprisePermission => Boolean(key)) ?? []
    );
  }
}
