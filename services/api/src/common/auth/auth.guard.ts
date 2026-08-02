import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "./jwt.service";
import { IS_PUBLIC_KEY } from "./public.decorator";

type RequestWithHeaders = {
  headers: Record<string, string | string[] | undefined>;
  user?: unknown;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authorization = request.headers.authorization;
    const header = Array.isArray(authorization) ? authorization[0] : authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authentification requise");
    }

    const token = header.slice("Bearer ".length).trim();
    request.user = this.jwt.verify(token, "access");

    return true;
  }
}
