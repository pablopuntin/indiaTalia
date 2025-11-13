import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { CashRegister } from './cash-register.entity';

export enum CashMovementType {
  INCOME = 'income',
  EXPENSE = 'expense',
  ADJUSTMENT = 'adjustment',
}

@Entity({ name: 'cash_movements' })
export class CashMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CashRegister, (register) => register.movements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'register_id' })
  register: CashRegister;

  @Column({ type: 'enum', enum: CashMovementType })
  type: CashMovementType;

  @Column('decimal')
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;
}
