import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductAuthorizationMiddleware } from './middleware/product-autorization.middleware';
import { TokenValidationMiddleware } from './middleware/token-validation.middleware';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware, ProductAuthorizationMiddleware)
      .exclude({ path: 'product', method: RequestMethod.GET })
      .exclude({ path: 'product/count', method: RequestMethod.GET })
      .forRoutes(ProductController);
  }
}
