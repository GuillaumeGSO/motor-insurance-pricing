import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from 'src/services/product.service';


@Controller('api/premium')
export class PriceController {
    constructor(private readonly productService: ProductService) { }


    @Get()
    async getPremium(@Query('productId') productId: string, @Query('location') location: string) {
        const product = await this.productService.findPriceByProductAndLocation(productId, location);
        if (!product) {
            throw new Error('Product not found for given location');
        }
        return { price: product.price };
    }
}