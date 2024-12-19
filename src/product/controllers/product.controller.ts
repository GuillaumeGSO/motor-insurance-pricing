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
  PremiumResponseDto,
  UpdateProductDetailsDto,
  UpdateProductDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get premium by productCode and Location' })
  @ApiQuery({ name: 'productCode', description: 'Product code' })
  @ApiQuery({ name: 'location', description: 'Location' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: PremiumResponseDto,
  })
  @Get()
  async getPremium(@Query() query: PremiumQueryDto) {
    const { productCode, location } = query;

    // Call the service with validated query params
    const premium = await this.productService.findPriceByProductAndLocation(
      productCode,
      location,
    );

    if (!premium) {
      throw new BadRequestException('Product not found for given location');
    }

    return premium;
  }
  @ApiOperation({ summary: 'Create new product into location' })
  @ApiBody({type: CreateProductDto})
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }



  @ApiOperation({ summary: 'Update price and description for a Product Code at a Location' })
  @ApiBody({type: UpdateProductDetailsDto})
  @ApiQuery({ name: 'productCode', description: 'Targeted product code' })
  @Put()
  async updateProduct(
    @Query('productCode') id: string,
    @Body() updateProductDto: UpdateProductDetailsDto,
  ) {
    return this.productService.updateProduct({
      ...updateProductDto,
      productCode: id,
    });
  }

  @ApiOperation({ summary: 'Delete product by code in all locations' })
  @ApiQuery({ name: 'productCode', description: 'Targeted product code' })
  @Delete()
  async deleteProduct(@Query('productCode') productCode: string) {
    return this.productService.deleteProduct(productCode);
  }
}
