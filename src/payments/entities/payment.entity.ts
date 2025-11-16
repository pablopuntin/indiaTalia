import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Payment {
  @ApiProperty({
    description: 'ID único del pago',
    example: 'a3f0c8e2-28cd-44d8-92b2-19aaf88c5678',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Orden asociada al pago',
  })
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({
    description: 'ID de la orden asociada',
    example: 'dfb94b01-44ea-42dc-9b3e-a1a5b65a4444',
  })
  @Column()
  orderId: string;

  @ApiProperty({
    description: 'Monto pagado',
    example: 2500.75,
  })
  @Column('decimal')
  amount: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    example: 'credit_card',
  })
  @Column()
  method: string;

  @ApiProperty({
    description: 'Usuario que registró el pago',
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'paidByUserId' })
  paidByUser: User;

  @ApiProperty({
    description: 'ID del usuario que registró el pago',
    example: 'd2a439fc-89cd-4b54-9d50-c33ab9123456',
  })
  @Column()
  paidByUserId: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales del pago',
    example: 'Pago parcial, resto a cubrir la próxima semana',
  })
  @Column({ nullable: true })
  notes?: string;
}
