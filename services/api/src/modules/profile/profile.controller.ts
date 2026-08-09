import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/auth/current-user.decorator";
import { ProfileService } from "./profile.service";

type RequestMeta = {
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.getProfile(user);
  }

  @Put()
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: unknown,
    @Req() request: RequestMeta
  ) {
    return this.profileService.updateProfile(user, body as never, this.getMeta(request));
  }

  @Post("avatar")
  updateAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { avatarUrl: string },
    @Req() request: RequestMeta
  ) {
    return this.profileService.updateAvatar(user, body.avatarUrl, this.getMeta(request));
  }

  @Delete("avatar")
  deleteAvatar(@CurrentUser() user: AuthenticatedUser, @Req() request: RequestMeta) {
    return this.profileService.deleteAvatar(user, this.getMeta(request));
  }

  @Put("password")
  updatePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { currentPassword: string; newPassword: string },
    @Req() request: RequestMeta
  ) {
    return this.profileService.updatePassword(user, body, this.getMeta(request));
  }

  @Get("sessions")
  getSessions(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.getSessions(user);
  }

  @Delete("sessions/:id")
  revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Req() request: RequestMeta
  ) {
    return this.profileService.revokeSession(user, id, this.getMeta(request));
  }

  @Post("logout-all")
  logoutAll(@CurrentUser() user: AuthenticatedUser, @Req() request: RequestMeta) {
    return this.profileService.logoutAll(user, this.getMeta(request));
  }

  private getMeta(request: RequestMeta) {
    const userAgent = request.headers["user-agent"];

    return {
      ipAddress: request.ip,
      userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    };
  }
}
