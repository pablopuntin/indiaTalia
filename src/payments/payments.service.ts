import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private ordersService: OrdersService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.ordersService.findOne(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');

    const payment = this.paymentsRepository.create(dto);
    await this.paymentsRepository.save(payment);

    // Actualizar estado de la orden según pagos
    // (implementar lógica para verificar monto total y pagos)
    // Por ejemplo:
    // if (pagosTotales >= order.total) { order.status = 'paid'; }

    return payment;
  }

  findAll() {
    return this.paymentsRepository.find();
  }

  findOne(id: string) {
    return this.paymentsRepository.findOneBy({ id });
  }

  async update(id: string, dto: Partial<CreatePaymentDto>) {
    await this.paymentsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.paymentsRepository.delete(id);
    return { deleted: true };
  }
}
