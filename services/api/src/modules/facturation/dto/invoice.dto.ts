import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  number!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  customer!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsDateString()
  due!: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  status!: string;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  customer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  due?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  status?: string;
}
