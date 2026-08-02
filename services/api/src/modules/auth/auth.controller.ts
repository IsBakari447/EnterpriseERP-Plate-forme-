import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Public } from "../../common/auth/public.decorator";
import { AuthService } from "./auth.service";

type AuthenticatedRequest = {
  user?: {
    sub: string;
    sessionId: string;
  };
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

type RegisterBody = {
  companyName: string;
  name: string;
  email: string;
  password: string;
  sector?: string;
  language?: string;
};

type LoginBody = {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceName?: string;
};

type RefreshBody = {
  refreshToken: string;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() body: RegisterBody, @Req() request: AuthenticatedRequest) {
    return this.authService.register(body, this.getMeta(request));
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginBody, @Req() request: AuthenticatedRequest) {
    return this.authService.login(body, this.getMeta(request));
  }

  @Public()
  @Post("refresh")
  refresh(@Body() body: RefreshBody, @Req() request: AuthenticatedRequest) {
    return this.authService.refresh(body.refreshToken, this.getMeta(request));
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
