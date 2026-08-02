import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { EnterprisePermission, EnterpriseRole, rolePermissions } from "./permissions";

type RequestWithUser = {
  user?: {
    role?: EnterpriseRole;
    permissions?: EnterprisePermission[];
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<EnterprisePermission[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user?.role) {
      throw new UnauthorizedException("Authentification requise");
    }

    const role = request.user.role;
    const explicitPermissions = request.user?.permissions ?? [];
    const inheritedPermissions = rolePermissions[role] ?? [];
    const effectivePermissions = new Set([...inheritedPermissions, ...explicitPermissions]);

    const allowed = requiredPermissions.every((permission) => effectivePermissions.has(permission));

    if (!allowed) {
      throw new ForbiddenException("Permission insuffisante");
    }

    return true;
  }
}
