import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../controllers/product.controller';
import { ProductService } from '../../services/product.service';
import {
  CreateProductDto,
  PremiumQueryDto,
  PremiumResponseDto,
  UpdateProductDetailsDto,
} from '../../dto/product.dto';
import { BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('ProductController', () => {
  let app: INestApplication;
  let productService: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findPriceByProductAndLocation: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    productService = module.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return premium for valid productCode and location', async () => {
    const premiumResponse: PremiumResponseDto = { premium: 100 };
    jest
      .spyOn(productService, 'findPriceByProductAndLocation')
      .mockResolvedValue(premiumResponse);

    const query: PremiumQueryDto = { productCode: 'P001', location: 'Zurich' };

    const response = await request(app.getHttpServer())
      .get('/product')
      .query(query)
      .expect(200);

    expect(response.body).toEqual(premiumResponse);
  });

  it('should throw BadRequestException for invalid productCode and location', async () => {
    jest
      .spyOn(productService, 'findPriceByProductAndLocation')
      .mockResolvedValue(null);

    const query: PremiumQueryDto = { productCode: 'P001', location: 'Unknown' };

    const response = await request(app.getHttpServer())
      .get('/product')
      .query(query)
      .expect(400);

    expect(response.body.message).toEqual(
      'Product not found for given location',
    );
  });

  it('should create a new product', async () => {
    const createProductDto: CreateProductDto = {
      productCode: 'P002',
      location: 'Zurich',
      price: 200,
    };
    jest
      .spyOn(productService, 'createProduct')
      .mockResolvedValue(createProductDto);

    const response = await request(app.getHttpServer())
      .post('/product')
      .send(createProductDto)
      .expect(201);

    expect(response.body).toEqual(createProductDto);
  });

  it('should update an existing product', async () => {
    const updateProductDto: UpdateProductDetailsDto = {
      location: 'Zurich',
      price: 150,
      description: 'Updated description',
    };
    const updatedProduct = { ...updateProductDto, productCode: 'P001' };
    jest
      .spyOn(productService, 'updateProduct')
      .mockResolvedValue(updatedProduct);

    const response = await request(app.getHttpServer())
      .put('/product')
      .query({ productCode: 'P001' })
      .send(updateProductDto)
      .expect(200);

    expect(response.body).toEqual(updatedProduct);
  });

  it('should delete a product by productCode', async () => {
    const productCode = 'P001';
    jest
      .spyOn(productService, 'deleteProduct')
      .mockResolvedValue({ deleted: true });

    const response = await request(app.getHttpServer())
      .delete('/product')
      .query({ productCode })
      .expect(200);

    expect(response.body).toEqual({ deleted: true });
  });
});
