import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StockService } from 'src/stock/stock.service';
import { StockMovementType } from 'src/stock/entities/stock.entity';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateOrderDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const items: OrderItem[] = [];
    let total = 0;

    for (const item of dto.items) {
      const variant = await this.variantRepo.findOne({ where: { id: item.variantId } });
      if (!variant) throw new NotFoundException(`Variant ${item.variantId} not found`);

      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${variant.name}`);
      }

      const subtotal = item.price * item.quantity;
      total += subtotal;

      // Registrar salida de stock
      await this.stockService.create({
        type: StockMovementType.EXIT,
        variantId: variant.id,
        userId: user.id,
        quantity: item.quantity,
        reason: 'Venta',
      });

      const orderItem = this.itemRepo.create({
        variant,
        quantity: item.quantity,
        price: item.price,
        subtotal,
      });
      items.push(orderItem);
    }

    const order = this.orderRepo.create({
      user,
      items,
      total,
      status: OrderStatus.PENDING,
    });

    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.orderRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return this.orderRepo.remove(order);
  }
}
