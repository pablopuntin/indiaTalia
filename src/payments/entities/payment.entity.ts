import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @Column('decimal')
  amount: number;

  @Column()
  method: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'paidByUserId' })
  paidByUser: User;

  @Column()
  paidByUserId: string;

  @Column({ nullable: true })
  notes?: string;
}

