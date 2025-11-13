import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement, StockMovementType } from './entities/stock.entity';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockRepo: Repository<StockMovement>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const variant = await this.variantRepo.findOne({ where: { id: dto.variantId } });
    if (!variant) throw new NotFoundException(`Variant ${dto.variantId} not found`);

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    // let supplier: Supplier | undefined;
    // if (dto.supplierId) {
    //   supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
    //   if (!supplier) throw new NotFoundException(`Supplier ${dto.supplierId} not found`);
    // }

    let supplier: Supplier | undefined;
if (dto.supplierId) {
  const found = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
  if (!found) throw new NotFoundException(`Supplier ${dto.supplierId} not found`);
  supplier = found;
}


    // ✅ Ajustar stock
    if (dto.type === StockMovementType.ENTRY) {
      variant.stock += dto.quantity;
    } else if (dto.type === StockMovementType.EXIT) {
      variant.stock -= dto.quantity;
      if (variant.stock < 0) variant.stock = 0; // evitar negativos
    }

    await this.variantRepo.save(variant);

    const movement = this.stockRepo.create({
      ...dto,
      variant,
      user,
      supplier,
    });

    return this.stockRepo.save(movement);
  }

  findAll(): Promise<StockMovement[]> {
    return this.stockRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StockMovement> {
    const movement = await this.stockRepo.findOne({ where: { id } });
    if (!movement) throw new NotFoundException(`StockMovement ${id} not found`);
    return movement;
  }

  async update(id: string, dto: UpdateStockMovementDto) {
    await this.stockRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const movement = await this.findOne(id);
    await this.stockRepo.remove(movement);
  }
}
