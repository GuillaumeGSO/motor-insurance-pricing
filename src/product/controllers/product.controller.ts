import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProductDto,
  PremiumQueryDto,
  PremiumResponseDto,
  UpdateProductDetailsDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  logger = new Logger(ProductController.name);

  @Get('count')
  async countProducts() {
    return this.productService.countProducts();
  }

  @ApiOperation({ summary: 'Get premium by productCode and Location' })
  @ApiQuery({ name: 'productCode', description: 'Product code' })
  @ApiQuery({ name: 'location', description: 'Location' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: PremiumResponseDto,
  })
  @Get()
  @ApiOperation({ summary: 'Fetch premium from criterias' })
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Premium retrieved successfully',
    type: PremiumResponseDto,
  })
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
    this.logger.verbose(
      `Premium for product ${productCode} at ${location} is ${premium.premium}`,
    );
    return premium;
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get all distinct locations' })
  @ApiResponse({
    status: 200,
    description: 'List of all locations',
    type: String,
    isArray: true,
  })
  async getAllLocations() {
    return this.productService.getAllLocations();
  }

  @Get('productsForLocation')
  @ApiOperation({ summary: 'Get all distinct products for a location' })
  @ApiQuery({ name: 'location', description: 'Location', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of all products for specified location',
    type: String,
    isArray: true,
  })
  async getAllProducts(@Query('location') location: string) {
    return this.productService.getAllProductsForLocation(location);
  }

  @ApiOperation({ summary: 'Create new product into location' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    this.logger.log(
      `Creating new product:  ${createProductDto.productCode} at ${createProductDto.location}`,
    );
    try {
      return await this.productService.createProduct(createProductDto);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create product: ' + error.message,
      );
    }
  }

  @ApiOperation({
    summary: 'Update price and description for a Product Code at a Location',
  })
  @ApiBody({ type: UpdateProductDetailsDto })
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
