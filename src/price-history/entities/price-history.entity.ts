import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { User } from 'src/users/entities/user.entity';
import { PriceRule } from 'src/price-rules/entities/price-rule.entity';

@Entity({ name: 'price_change_history' })
export class PriceChangeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductVariant, { eager: true })
  variant: ProductVariant;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  oldPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  newPrice: number;

  @CreateDateColumn()
  changedAt: Date;

  @ManyToOne(() => User, { eager: true, nullable: true })
  changedBy?: User;

  @Column({ type: 'varchar', length: 50 })
  source: 'manual' | 'rule' | 'system';

  @ManyToOne(() => PriceRule, { nullable: true })
  priceRule?: PriceRule;
}
