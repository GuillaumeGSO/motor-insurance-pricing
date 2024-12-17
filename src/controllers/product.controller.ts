import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';

@Controller('api/products')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  //   @Put(':id')
  //   async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //     return this.productService.updateProduct(id, updateProductDto);
  //   }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
