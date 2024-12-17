import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from '../db/models/product.entity';
import { CreateProductDto } from '../dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    console.log(createProductDto);
    const product = this.productRepository.create(createProductDto);
    console.log(product)
    return this.productRepository.save(product);
  }

  // async updateProduct(updateProductDto: UpdateProductDto): Promise<ProductEntity> {
  //     return this.productRepository.update(updateProductDto);
  // }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async findPriceByProductAndLocation(
    productCode: string,
    location: string,
  ): Promise<ProductEntity | undefined> {
    console.log(productCode, location)
    return this.productRepository.findOne({ where: { productCode, location } });
  }
}
