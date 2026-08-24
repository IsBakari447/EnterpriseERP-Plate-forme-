import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { EnterprisePermission, EnterpriseRole } from "../security/permissions";

export type AuthenticatedUser = {
  sub: string;
  email: string;
  companyId: string | null;
  role: EnterpriseRole;
  sessionId: string;
  permissions?: EnterprisePermission[];
};

type RequestWithUser = {
  user?: AuthenticatedUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new UnauthorizedException("Authentication required");
    }

    return request.user;
  }
);

export function requireTenant(user: AuthenticatedUser) {
  if (!user.companyId) {
    throw new UnauthorizedException("Company context required for this operation");
  }

  return user.companyId;
}
