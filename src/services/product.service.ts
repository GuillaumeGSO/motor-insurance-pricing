import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/db/models/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) { }

    async findPriceByProductAndLocation(productId: string, location: string): Promise<ProductEntity | undefined> {
        return this.productRepository.findOne({ where: { productId, location } });
    }
}