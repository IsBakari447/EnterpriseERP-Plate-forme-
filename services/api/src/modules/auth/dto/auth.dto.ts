import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

const allowedLanguages = ["fr", "en", "sv", "de", "es", "pt", "it", "nl"];
const allowedSectors = [
  "general",
  "restaurant",
  "commerce",
  "construction",
  "sante",
  "education",
  "transport",
  "industrie",
  "hospitality",
  "agriculture",
  "livestock",
  "hotel",
];

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @IsIn(allowedSectors)
  sector?: string;

  @IsOptional()
  @IsString()
  @IsIn(allowedLanguages)
  language?: string;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  deviceName?: string;
}

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  token!: string;
}

export class ResendVerificationDto {
  @IsEmail()
  @MaxLength(160)
  email!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(160)
  email!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  code!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  confirmPassword!: string;
}
