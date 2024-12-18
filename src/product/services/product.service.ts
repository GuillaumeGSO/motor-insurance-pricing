import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = this.productRepository.create(createProductDto);
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
    console.log(productCode, location);
    return this.productRepository.findOne({ where: { productCode, location } });
  }
}
