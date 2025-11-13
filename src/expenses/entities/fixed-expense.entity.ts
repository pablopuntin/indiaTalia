import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Entity({ name: 'fixed_expenses' })
export class FixedExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 'monthly' })
  frequency: string; // monthly, weekly, yearly...

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @CreateDateColumn()
  createdAt: Date;
}

