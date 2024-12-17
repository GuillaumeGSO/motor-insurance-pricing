import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('products')
@Index('IDX_PRODUCT_PRODUCTID', ['productId']) // Single-column index for productId
export class ProductEntity {

    @PrimaryColumn({ type: 'varchar', length: 30 })
    productId: string;

    @Column({ type: 'varchar', length: 300 })
    productDesc: string;

    @PrimaryColumn({ type: 'varchar', length: 50 })
    location: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

}