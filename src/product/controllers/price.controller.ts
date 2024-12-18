import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PremiumQueryDto } from 'src/product/dto/product.dto';
import { ProductService } from 'src/product/services/product.service';

@Controller('api/premium')
export class PriceController {
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

    return { price: product.price };
  }
}
