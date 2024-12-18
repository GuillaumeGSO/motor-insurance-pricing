import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceController } from './controllers/price.controller';
import { AdminProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './services/product.service';


@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService],
  controllers: [PriceController, AdminProductController],
})
export class ProductModule {}
