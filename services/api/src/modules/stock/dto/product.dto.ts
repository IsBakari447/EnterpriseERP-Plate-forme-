import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  sku!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  status!: string;

  @IsNumber()
  @Min(0)
  value!: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(140)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;
}
