import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateProductDto,
  PremiumQueryDto,
  UpdateProductDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getPremium(@Query() query: PremiumQueryDto) {
    const { productCode, location } = query;

    // Call the service with validated query params
    const product = await this.productService.findPriceByProductAndLocation(
      productCode,
      location,
    );

    if (!product) {
      throw new BadRequestException('Product not found for given location');
    }

    return { premium: product.price };
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Put()
  async updateProduct(
    @Query('productCode') id: string,
    @Body() updateProductDto: Omit<UpdateProductDto, 'productCode'>,
  ) {
    return this.productService.updateProduct({
      ...updateProductDto,
      productCode: id,
    });
  }

  @Delete()
  async deleteProduct(@Query('productCode') productCode: string) {
    return this.productService.deleteProduct(productCode);
  }
}
