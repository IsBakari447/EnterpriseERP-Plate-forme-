import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { Public } from "../../common/auth/public.decorator";
import { TenantOptional } from "../../common/tenant/tenant-optional.decorator";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto, LoginDto, MfaChallengeDto, MfaDisableDto, MfaSetupDto, MfaVerifyDto, RefreshDto, RegisterDto, ResendVerificationDto, ResetPasswordDto, VerifyEmailDto } from "./dto/auth.dto";

type AuthenticatedRequest = {
  user?: {
    sub: string;
    sessionId: string;
  };
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

type CookieResponse = {
  cookie(name: string, value: string, options: Record<string, unknown>): void;
  clearCookie(name: string, options: Record<string, unknown>): void;
};

const REFRESH_COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-enterpriseerp-refresh" : "enterpriseerp-refresh";

@Controller("auth")
@TenantOptional()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() body: RegisterDto, @Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse) {
    return this.withRefreshCookie(await this.authService.register(body, this.getMeta(request)), response);
  }

  @Public()
  @Post("login")
  async login(@Body() body: LoginDto, @Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse) {
    return this.withRefreshCookie(await this.authService.login(body, this.getMeta(request)), response);
  }

  @Public()
  @Post("refresh")
  async refresh(@Body() body: RefreshDto, @Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse) {
    const refreshToken = body.refreshToken ?? this.getRefreshTokenCookie(request);
    return this.withRefreshCookie(await this.authService.refresh(refreshToken ?? "", this.getMeta(request)), response);
  }

  @Public()
  @Post("verify-email")
  verifyEmail(@Body() body: VerifyEmailDto, @Req() request: AuthenticatedRequest) {
    return this.authService.verifyEmail(body.token, this.getMeta(request));
  }

  @Public()
  @Post("resend-verification")
  resendVerification(@Body() body: ResendVerificationDto, @Req() request: AuthenticatedRequest) {
    return this.authService.resendVerification(body.email, this.getMeta(request));
  }

  @Post("mfa/setup")
  setupMfa(@CurrentUser() user: AuthenticatedUser, @Body() body: MfaSetupDto, @Req() request: AuthenticatedRequest) {
    return this.authService.setupMfa(user.sub, body.password, this.getMeta(request));
  }

  @Post("mfa/verify")
  verifyMfaSetup(@CurrentUser() user: AuthenticatedUser, @Body() body: MfaVerifyDto, @Req() request: AuthenticatedRequest) {
    return this.authService.verifyMfaSetup(user.sub, body.code, this.getMeta(request));
  }

  @Public()
  @Post("mfa/challenge")
  async challengeMfa(@Body() body: MfaChallengeDto, @Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse) {
    return this.withRefreshCookie(await this.authService.completeMfaChallenge(body, this.getMeta(request)), response);
  }

  @Post("mfa/disable")
  disableMfa(@CurrentUser() user: AuthenticatedUser, @Body() body: MfaDisableDto, @Req() request: AuthenticatedRequest) {
    return this.authService.disableMfa(user.sub, body, this.getMeta(request));
  }

  @Post("mfa/recovery")
  regenerateMfaRecovery(@CurrentUser() user: AuthenticatedUser, @Body() body: MfaVerifyDto, @Req() request: AuthenticatedRequest) {
    return this.authService.regenerateMfaRecoveryCodes(user.sub, body.code, this.getMeta(request));
  }

  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() body: ForgotPasswordDto, @Req() request: AuthenticatedRequest) {
    return this.authService.forgotPassword(body, this.getMeta(request));
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() body: ResetPasswordDto, @Req() request: AuthenticatedRequest) {
    return this.authService.resetPassword(body, this.getMeta(request));
  }

  @Post("logout")
  logout(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse) {
    this.clearRefreshCookie(response);

    if (!request.user?.sessionId) {
      return { success: true };
    }

    return this.authService.logout(request.user.sessionId);
  }

  @Get("me")
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user?.sub ?? "");
  }

  private getMeta(request: AuthenticatedRequest) {
    const userAgent = request.headers["user-agent"];

    return {
      ipAddress: request.ip,
      userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    };
  }

  private getCookieOptions(maxAge?: number) {
    const isProduction = process.env.NODE_ENV === "production";

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      ...(maxAge ? { maxAge } : {}),
    };
  }

  private setRefreshCookie(response: CookieResponse, refreshToken: string) {
    response.cookie(REFRESH_COOKIE_NAME, refreshToken, this.getCookieOptions(this.authService.getRefreshTokenLifetimeMs()));
  }

  private clearRefreshCookie(response: CookieResponse) {
    response.clearCookie(REFRESH_COOKIE_NAME, this.getCookieOptions());
  }

  private getRefreshTokenCookie(request: AuthenticatedRequest) {
    const cookieHeader = request.headers.cookie;
    const rawCookie = Array.isArray(cookieHeader) ? cookieHeader.join("; ") : cookieHeader;
    if (!rawCookie) return null;

    const cookies = rawCookie.split(";").map((part) => part.trim());
    const cookie = cookies.find((part) => part.startsWith(`${REFRESH_COOKIE_NAME}=`));
    if (!cookie) return null;

    return decodeURIComponent(cookie.slice(REFRESH_COOKIE_NAME.length + 1));
  }

  private withRefreshCookie<T>(payload: T, response: CookieResponse) {
    if (!payload || typeof payload !== "object" || !("refreshToken" in payload)) {
      return payload;
    }

    const sessionPayload = payload as T & { refreshToken?: string };
    if (sessionPayload.refreshToken) {
      this.setRefreshCookie(response, sessionPayload.refreshToken);
    }

    if (process.env.NODE_ENV === "production") {
      const { refreshToken, ...safePayload } = sessionPayload;
      return safePayload;
    }

    return payload;
  }
}
