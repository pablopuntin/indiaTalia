import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Entity({ name: 'variable_expenses' })
export class VariableExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @CreateDateColumn()
  createdAt: Date;
}
