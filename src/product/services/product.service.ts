import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  CreateProductDto,
  IProductDto,
  PremiumResponseDto,
  UpdateProductDto,
} from '../dto/product.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  logger = new Logger(ProductService.name);

  async countProducts(): Promise<number> {
    return this.productRepository.count();
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<IProductDto> {
    try {
      const product = this.productRepository.create(
        this.toEntity(createProductDto),
      );
      await this.productRepository.save(product);
      this.logger.log(`Product created: ${product.productcode}`);
      return this.toDto(product);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new Error('Product already exists in the location.');
      } else {
        throw new Error('Error creating product: ' + error.message);
      }
    }
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
  ): Promise<IProductDto> {
    const { productCode, location } = updateProductDto;
    // Ensure the product exists before updating
    const product = await this.productRepository.findOneBy({
      productcode: productCode,
      location,
    });

    if (!product) {
      throw new NotFoundException(
        `Product with code ${productCode} in location ${location} not found.`,
      );
    }

    // Perform the update
    await this.productRepository.update(
      { productcode: productCode, location },
      this.toEntity(updateProductDto),
    );

    // Fetch the updated entity
    const updatedProduct = await this.productRepository.findOneBy({
      productcode: productCode,
      location,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Failed to fetch the updated product.`);
    }

    return this.toDto(updatedProduct);
  }

  async deleteProduct(productCode: string): Promise<{ deleted: boolean }> {
    const result = await this.productRepository.delete({
      productcode: productCode,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Product with code ${productCode} not found.`,
      );
    }
    return { deleted: true };
  }

  async findPriceByProductAndLocation(
    productcode: string,
    location: string,
  ): Promise<PremiumResponseDto | undefined> {
    const result = await this.productRepository.findOne({
      where: { productcode, location },
    });
    return { premium: result?.price } as PremiumResponseDto;
  }

  //Can move that to a specific mapping service later

  toEntity(dto: IProductDto): ProductEntity | null {
    if (!dto) {
      return null;
    }
    return {
      productcode: dto.productCode,
      location: dto.location,
      productdesc: dto.productDesc,
      price: dto.price,
    } as ProductEntity;
  }

  toDto(entity: ProductEntity): IProductDto {
    return {
      productCode: entity.productcode,
      location: entity.location,
      productDesc: entity.productdesc,
      price: entity.price,
    } as IProductDto;
  }
}
