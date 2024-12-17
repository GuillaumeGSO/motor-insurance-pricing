import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, IsBoolean, isInt, IsNumber } from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productCode: string;

    @IsOptional()
    @IsString()
    productDesc?: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

}

export class UpdateProductDto {

    @IsString()
    @IsNotEmpty()
    productCode: string

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