import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  CreateProductDto,
  IProductDto,
  PremiumResponseDto,
  UpdateProductDetailsDto,
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

  async getAllLocations(): Promise<string[]> {
    const locations = await this.productRepository
      .createQueryBuilder('products')
      .select('DISTINCT products.location')
      .orderBy('products.location', 'ASC')
      .getRawMany();

    return locations.map((zone) => zone.location);
  }

  async getAllProductsForLocation(
    location: string,
  ): Promise<IProductDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('products')
      .select(
        'DISTINCT products.productcode, products.productdesc, products.location',
      )
      .where('products.location = :location', { location })
      .orderBy('products.productdesc', 'ASC')
      .getRawMany();

    return products.map((product) => ({
      productCode: product.productcode,
      productDesc: product.productdesc,
      location: product.location
    }));
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
      product.id,
      this.toUpdateEntity(updateProductDto),
    );

    // Fetch the updated entity
    const updatedProduct = await this.productRepository.findOneBy({
      productcode: productCode,
      location,
    });

    // Check if the product was updated successfully
    if (!updatedProduct) {
      throw new NotFoundException(`Failed to fetch the updated product.`);
    }

    return this.toDto(updatedProduct);
  }

  async deleteProduct(
    productCode: string,
  ): Promise<{ productCode: string; deleted: boolean }> {
    const result = await this.productRepository.delete({
      productcode: productCode,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Product with code ${productCode} not found.`,
      );
    }
    return {
      productCode: productCode,
      deleted: true,
    };
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

  toEntity(dto: CreateProductDto ): ProductEntity | null {
    if (!dto) {
      return null;
    }
    return {
      productcode: dto?.productCode,
      location: dto.location,
      productdesc: dto.productDesc,
      price: dto.price,
    } as ProductEntity;
  }

   toUpdateEntity(dto: UpdateProductDetailsDto ): ProductEntity | null {
    if (!dto) {
      return null;
    }
    return {
      location: dto.location,
      productdesc: dto.description,
      price: dto.price,
    } as ProductEntity;
  }

  toDto(entity: ProductEntity): CreateProductDto | null {
    if (!entity) {
      return null;
    }
    return {
      productCode: entity.productcode,
      location: entity.location,
      productDesc: entity.productdesc,
      price: entity.price,
    } as IProductDto;
  }
}
