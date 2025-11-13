import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { CashMovement } from './cash-movement.entity';

@Entity({ name: 'cash_registers' })
export class CashRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  openedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @Column({ type: 'decimal', default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', default: 0 })
  closingBalance: number;

  @Column({ default: false })
  isClosed: boolean;

  @OneToMany(() => CashMovement, (movement) => movement.register)
  movements: CashMovement[];
}
