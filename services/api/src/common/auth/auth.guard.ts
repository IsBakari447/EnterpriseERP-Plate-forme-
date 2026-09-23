import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma.service";
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
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      throw new UnauthorizedException("Authentication required");
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = this.jwt.verify(token, "access");
    const session = await this.prisma.userSession.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        user: {
          select: {
            status: true,
            passwordChangedAt: true,
          },
        },
      },
    });

    if (!session || session.user.status !== "ACTIVE") {
      throw new UnauthorizedException("Session expired.");
    }

    if (session.user.passwordChangedAt && payload.iat <= Math.floor(session.user.passwordChangedAt.getTime() / 1000)) {
      throw new UnauthorizedException("Session expired.");
    }

    request.user = payload;

    return true;
  }
}
