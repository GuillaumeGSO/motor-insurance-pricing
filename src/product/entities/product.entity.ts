import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('products')
@Index('IDX_PRODUCT_PRODUCT_CODE', ['productcode'])
export class ProductEntity {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  productcode: string;

  @Column({ type: 'varchar', length: 300 })
  productdesc: string;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  location: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;
}
