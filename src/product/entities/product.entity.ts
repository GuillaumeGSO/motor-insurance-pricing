import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('products')
@Unique(['productcode', 'location'])
@Index(['productcode', 'location'])
export class ProductEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  productcode: string;

  @Column({ type: 'varchar', length: 50 })
  location: string;

  @Column({ type: 'varchar', length: 300 })
  productdesc: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;
}
