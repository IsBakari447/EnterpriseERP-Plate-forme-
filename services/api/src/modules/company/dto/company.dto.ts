import { IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

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

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MaxLength(140)
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(allowedSectors)
  sector?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  businessType?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsString()
  @IsIn(allowedLanguages)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  dateFormat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  numberFormat?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabledModules?: string[];

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}

export class UpdateCompanyModulesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabledModules?: string[];
}
