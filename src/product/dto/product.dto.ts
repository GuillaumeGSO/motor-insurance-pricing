import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PremiumQueryDto implements Partial<IProductDto> {
  @ApiProperty({ description: 'Product code', required: true })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiProperty({ description: 'Location (case sensitive)', required: true })
  @IsString()
  @IsNotEmpty()
  location: string;
}

export class PremiumResponseDto {
  @ApiProperty({ description: 'Premium in local currency' })
  premium: number
}

export class CreateProductDto implements IProductDto {
  @ApiProperty({ description: 'Product code', required: true })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiProperty({ description: 'Product description', required: false })
  @IsOptional()
  @IsString()
  productDesc?: string;

  @ApiProperty({ description: 'Location', required: true })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Price', required: true })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}

export class UpdateProductDto implements IProductDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  productDesc?: string;
}

export class UpdateProductDetailsDto implements Partial<IProductDto> {
  @ApiProperty({ description: 'Targeted Location', required: true })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Updated descrition', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Updated Price', required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export interface IProductDto {
  productCode: string;
  location: string;
  price?: number;
  productDesc?: string;
}
