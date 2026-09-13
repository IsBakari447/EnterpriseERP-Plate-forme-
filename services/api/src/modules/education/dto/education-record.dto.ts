import { IsArray, IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class EducationRecordDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  matricule?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  teacherCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  courseName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  className?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  studentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  feeName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  level?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  guardian?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  status?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weeklyHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  participants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  average?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paid?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classes?: string[];
}
