import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../../services/product.service';
import {
  CreateProductDto,
  IProductDto,
  PremiumResponseDto,
  UpdateProductDto,
} from '../../dto/product.dto';
import { ProductEntity } from '../../entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        productCode: '1000',
        productDesc: 'Sedan',
        location: 'Malaysia',
        price: 300,
      };

      const productEntity: ProductEntity = {
        productcode: createProductDto.productCode,
        productdesc: createProductDto.productDesc,
        ...createProductDto,
      };

      const productDto: IProductDto = {
        productCode: '1000',
        productDesc: 'Sedan',
        location: 'Malaysia',
        price: 300,
      };

      // Given
      mockRepository.create.mockReturnValue(productEntity);
      mockRepository.save.mockResolvedValue(productEntity);
      jest.spyOn(service, 'toEntity').mockReturnValue(productEntity);
      jest.spyOn(service, 'toDto').mockReturnValue(productDto);

      // When
      const result = await service.createProduct(createProductDto);

      // Then
      expect(mockRepository.create).toHaveBeenCalledWith(productEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(productEntity);
      expect(service.toEntity).toHaveBeenCalledWith(createProductDto);
      expect(service.toDto).toHaveBeenCalledWith(productEntity);
      expect(result).toEqual(productDto);
    });

    it('should throw an error if product creation fails', async () => {
      const createProductDto: CreateProductDto = {
        productCode: '1000',
        productDesc: 'Sedan',
        location: 'Malaysia',
        price: 300,
      };

      const errorMessage = 'Database error';

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(new Error(errorMessage));
      jest.spyOn(service, 'toEntity').mockReturnValue(null);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        'Error creating product: ' + errorMessage,
      );

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should update a product successfully', async () => {
      // Given
      const updateProductDto: UpdateProductDto = {
        productCode: '1000',
        productDesc: 'Updated Sedan',
        location: 'Malaysia',
        price: 400,
      };

      const existingProduct: ProductEntity = {
        productcode: '1000',
        location: 'Malaysia',
        productdesc: 'Sedan',
        price: 300,
      };

      const updatedProduct: ProductEntity = {
        productcode: '1000',
        location: 'Malaysia',
        productdesc: 'Updated Sedan',
        price: 400,
      };

      const updatedProductDto: IProductDto = {
        productCode: '1000',
        productDesc: 'Updated Sedan',
        location: 'Malaysia',
        price: 400,
      };
      mockRepository.findOneBy.mockResolvedValueOnce(existingProduct);
      mockRepository.findOneBy.mockResolvedValueOnce(updatedProduct);
      mockRepository.update.mockResolvedValue(undefined);
      jest.spyOn(service, 'toEntity').mockReturnValue(updatedProduct);
      jest.spyOn(service, 'toDto').mockReturnValue(updatedProductDto);

      // When
      const result = await service.updateProduct(updateProductDto);

      // Then
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productcode: '1000',
        location: 'Malaysia',
      });
      expect(mockRepository.update).toHaveBeenCalledWith(
        { productcode: '1000', location: 'Malaysia' },
        updatedProduct,
      );
      expect(service.toEntity).toHaveBeenCalledWith(updateProductDto);
      expect(service.toDto).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProductDto);
    });

    it('should throw an error if the product does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        productCode: '9999',
        productDesc: 'Nonexistent Product',
        location: 'Nowhere',
        price: 400,
      };

      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateProduct(updateProductDto)).rejects.toThrow(
        `Product with code 9999 in location Nowhere not found.`,
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productcode: '9999',
        location: 'Nowhere',
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if fetching the updated product fails', async () => {
      const updateProductDto: UpdateProductDto = {
        productCode: '1000',
        productDesc: 'Updated Sedan',
        location: 'Malaysia',
        price: 400,
      };

      const existingProduct = {
        productcode: '1000',
        location: 'Malaysia',
        productdesc: 'Sedan',
        price: 300,
      } as ProductEntity;

      mockRepository.findOneBy.mockResolvedValueOnce(existingProduct);
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      mockRepository.update.mockResolvedValue(undefined);
      jest.spyOn(service, 'toEntity').mockReturnValue(existingProduct);

      await expect(service.updateProduct(updateProductDto)).rejects.toThrow(
        `Failed to fetch the updated product.`,
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(2); // Called twice: for existence and fetching updated product
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      // Given
      const productCode = '1000';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      // When
      const result = await service.deleteProduct(productCode);

      // Then
      expect(mockRepository.delete).toHaveBeenCalledWith({
        productcode: productCode,
      });
      expect(result).toEqual({ deleted: true });
    });

    it('should throw a NotFoundException if the product is not found', async () => {
      const productCode = '9999';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteProduct(productCode)).rejects.toThrow(
        new NotFoundException(`Product with code ${productCode} not found.`),
      );

      expect(mockRepository.delete).toHaveBeenCalledWith({
        productcode: productCode,
      });
    });
  });

  describe('findPriceByProductAndLocation', () => {
    it('should return the price of the product for the given product code and location', async () => {
      // Given
      const productCode = '1000';
      const location = 'Malaysia';

      const productEntity: ProductEntity = {
        productcode: '1000',
        location: 'Malaysia',
        price: 300,
      } as ProductEntity;

      const expectedResponse: PremiumResponseDto = {
        premium: 300,
      };

      mockRepository.findOne.mockResolvedValue(productEntity);

      // When
      const result = await service.findPriceByProductAndLocation(
        productCode,
        location,
      );

      // Then
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { productcode: productCode, location },
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should return undefined if no product is found', async () => {
      const productCode = '9999';
      const location = 'Nowhere';

      mockRepository.findOne.mockResolvedValue(null);

      // Execute service method
      const result = await service.findPriceByProductAndLocation(
        productCode,
        location,
      );

      // Assertions
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { productcode: productCode, location },
      });
      expect(result).toEqual({ premium: undefined });
    });
  });
});
