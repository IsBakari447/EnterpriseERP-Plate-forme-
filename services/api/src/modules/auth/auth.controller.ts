import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Public } from "../../common/auth/public.decorator";
import { TenantOptional } from "../../common/tenant/tenant-optional.decorator";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto, LoginDto, RefreshDto, RegisterDto, ResendVerificationDto, ResetPasswordDto, VerifyEmailDto } from "./dto/auth.dto";

type AuthenticatedRequest = {
  user?: {
    sub: string;
    sessionId: string;
  };
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

@Controller("auth")
@TenantOptional()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() body: RegisterDto, @Req() request: AuthenticatedRequest) {
    return this.authService.register(body, this.getMeta(request));
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginDto, @Req() request: AuthenticatedRequest) {
    return this.authService.login(body, this.getMeta(request));
  }

  @Public()
  @Post("refresh")
  refresh(@Body() body: RefreshDto, @Req() request: AuthenticatedRequest) {
    return this.authService.refresh(body.refreshToken, this.getMeta(request));
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
  logout(@Req() request: AuthenticatedRequest) {
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
}
