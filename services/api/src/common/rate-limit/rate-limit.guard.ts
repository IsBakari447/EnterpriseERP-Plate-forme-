import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RateLimitService } from "./rate-limit.service";

type RequestLike = {
  ip?: string;
  method?: string;
  originalUrl?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
};

type RateLimitRule = {
  id: string;
  pattern: RegExp;
  limit: number;
  windowMs: number;
  includeBodyEmail?: boolean;
};

const minute = 60 * 1000;

const rules: RateLimitRule[] = [
  { id: "auth-login", pattern: /^\/api\/auth\/login$/i, limit: 8, windowMs: 15 * minute, includeBodyEmail: true },
  { id: "auth-register", pattern: /^\/api\/auth\/register$/i, limit: 5, windowMs: 60 * minute },
  { id: "auth-forgot-password", pattern: /^\/api\/auth\/forgot-password$/i, limit: 5, windowMs: 15 * minute, includeBodyEmail: true },
  { id: "auth-reset-password", pattern: /^\/api\/auth\/reset-password$/i, limit: 10, windowMs: 15 * minute },
  { id: "auth-verify-email", pattern: /^\/api\/auth\/verify-email$/i, limit: 30, windowMs: 15 * minute },
  { id: "auth-resend-verification", pattern: /^\/api\/auth\/resend-verification$/i, limit: 5, windowMs: 15 * minute, includeBodyEmail: true },
  { id: "auth-mfa", pattern: /^\/api\/auth\/mfa\//i, limit: 8, windowMs: 15 * minute },
  { id: "auth-refresh", pattern: /^\/api\/auth\/refresh$/i, limit: 60, windowMs: 15 * minute },
  { id: "assistant", pattern: /^\/api\/operations\/assistant\//i, limit: 30, windowMs: minute },
  { id: "global", pattern: /^\/api\//i, limit: 300, windowMs: minute },
];

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimit: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestLike & { body?: { email?: unknown } }>();
    const path = this.getPath(request);
    const rule = rules.find((candidate) => candidate.pattern.test(path));

    if (!rule) return true;

    const key = this.createKey(rule, request);
    const result = await this.rateLimit.hit(key, rule.limit, rule.windowMs);

    if (result.allowed) return true;

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: "Too many requests. Please try again later.",
        retryAfterSeconds: Math.ceil(result.retryAfterMs / 1000),
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }

  private getPath(request: RequestLike) {
    return (request.originalUrl ?? request.url ?? "").split("?")[0] ?? "";
  }

  private createKey(rule: RateLimitRule, request: RequestLike & { body?: { email?: unknown } }) {
    const ip = this.getClientIp(request);
    const emailPart = rule.includeBodyEmail && typeof request.body?.email === "string" ? `:${request.body.email.trim().toLowerCase()}` : "";

    return `rate:${rule.id}:${ip}${emailPart}`;
  }

  private getClientIp(request: RequestLike) {
    const forwardedFor = request.headers?.["x-forwarded-for"];
    const firstForwardedFor = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const forwardedIp = firstForwardedFor?.split(",")[0]?.trim();

    return forwardedIp || request.ip || "unknown";
  }
}
