// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { StockMovement, StockMovementType } from './entities/stock.entity';
// import { CreateStockMovementDto } from './dto/create-stock.dto';
// import { UpdateStockMovementDto } from './dto/update-stock.dto';
// import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
// import { Supplier } from 'src/suppliers/entities/supplier.entity';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class StockService {
//   constructor(
//     @InjectRepository(StockMovement)
//     private readonly stockRepo: Repository<StockMovement>,

//     @InjectRepository(ProductVariant)
//     private readonly variantRepo: Repository<ProductVariant>,

//     @InjectRepository(Supplier)
//     private readonly supplierRepo: Repository<Supplier>,

//     @InjectRepository(User)
//     private readonly userRepo: Repository<User>,
//   ) {}

//   // ✅ Nuevo método auxiliar para evitar repetir código
//   private async findEntityOrFail<T extends { id: any }>(
//   repo: Repository<T>,
//   id: string,
//   entityName: string,
// ): Promise<T> {
//   const found = await repo.findOne({ where: { id } as any });
//   if (!found) throw new NotFoundException(`${entityName} ${id} not found`);
//   return found;
// }


//   async create(dto: CreateStockMovementDto): Promise<StockMovement> {
//     const variant = await this.findEntityOrFail(this.variantRepo, dto.variantId, 'Variant');
//     const user = await this.findEntityOrFail(this.userRepo, dto.userId, 'User');
//     const supplier = dto.supplierId
//       ? await this.findEntityOrFail(this.supplierRepo, dto.supplierId, 'Supplier')
//       : undefined;

//    // ✅ Ajustar stock con validación
// if (dto.type === StockMovementType.ENTRY) {
//   variant.stock += dto.quantity;
// } else if (dto.type === StockMovementType.EXIT) {
//   if (variant.stock < dto.quantity) {
//     throw new BadRequestException(
//       `Not enough stock for ${variant.name}. Current: ${variant.stock}, trying to remove: ${dto.quantity}`,
//     );
//   }
//   variant.stock -= dto.quantity;
// }


//    await this.variantRepo.save(variant);

// // ⚠️ Verificar si el stock cae bajo el mínimo
// if (variant.stock <= variant.minStock) {
//   console.warn(`⚠️ Variant ${variant.name} is below minimum stock (${variant.stock}/${variant.minStock})`);
//   // En el futuro: enviar notificación, crear tarea o pedido automático al proveedor
// }

//     const movement = this.stockRepo.create({
//       ...dto,
//       variant,
//       user,
//       supplier,
//     });

//     return this.stockRepo.save(movement);
//   }

//   findAll(): Promise<StockMovement[]> {
//     return this.stockRepo.find({
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findOne(id: string): Promise<StockMovement> {
//     const movement = await this.stockRepo.findOne({ where: { id } });
//     if (!movement) throw new NotFoundException(`StockMovement ${id} not found`);
//     return movement;
//   }

//   async update(id: string, dto: UpdateStockMovementDto) {
//     await this.stockRepo.update(id, dto);
//     return this.findOne(id);
//   }

//   async remove(id: string) {
//     const movement = await this.findOne(id);
//     await this.stockRepo.remove(movement);
//   }
// }

//refactor
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement, StockMovementType } from './entities/stock.entity';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { StockAlert } from './entities/stock-alert.entity'; // ⚠️ Nueva entidad para alertas

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

    @InjectRepository(StockAlert)
    private readonly alertRepo: Repository<StockAlert>,
  ) {}

  /** 🔍 Reutilizable: busca cualquier entidad o lanza excepción si no existe */
  private async findEntityOrFail<T extends { id: string }>(
    repo: Repository<T>,
    id: string,
    entityName: string,
  ): Promise<T> {
    const found = await repo.findOne({ where: { id } as any });
    if (!found) throw new NotFoundException(`${entityName} ${id} not found`);
    return found;
  }

  /** 🏗️ Crea un movimiento de stock (entrada/salida/ajuste) */
  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const variant = await this.findEntityOrFail(this.variantRepo, dto.variantId, 'Variant');
    const user = await this.findEntityOrFail(this.userRepo, dto.userId, 'User');
    const supplier = dto.supplierId
      ? await this.findEntityOrFail(this.supplierRepo, dto.supplierId, 'Supplier')
      : undefined;

    // 🧮 Ajuste de stock
    if (dto.type === StockMovementType.ENTRY) {
      variant.stock += dto.quantity;
    } else if (dto.type === StockMovementType.EXIT) {
      if (variant.stock < dto.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${variant.name}. Current: ${variant.stock}, trying to remove: ${dto.quantity}`,
        );
      }
      variant.stock -= dto.quantity;
    } else if (dto.type === StockMovementType.ADJUSTMENT) {
      variant.stock = dto.quantity;
    }

    // 🧩 Si no tiene minStock definido, por defecto 5
    if (variant.minStock === null || variant.minStock === undefined) {
      variant.minStock = 5;
    }

    await this.variantRepo.save(variant);

    // ⚠️ Crear alerta si el stock está por debajo del mínimo
    if (variant.stock <= variant.minStock) {
      const existing = await this.alertRepo.findOne({
        where: { variant: { id: variant.id }, resolved: false },
      });

      if (!existing) {
        const alert = this.alertRepo.create({
          variant,
          currentStock: variant.stock,
          minStock: variant.minStock,
          message: `Stock bajo para ${variant.name}: ${variant.stock}/${variant.minStock}`,
        });
        await this.alertRepo.save(alert);
      }
    }

    // 💾 Registrar el movimiento
    const movement = this.stockRepo.create({
      ...dto,
      variant,
      user,
      supplier,
    });

    return this.stockRepo.save(movement);
  }

  /** 📜 Listar todos los movimientos */
  findAll(): Promise<StockMovement[]> {
    return this.stockRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['variant', 'user', 'supplier'],
    });
  }

  /** 🔍 Buscar un movimiento por ID */
  async findOne(id: string): Promise<StockMovement> {
    const movement = await this.stockRepo.findOne({
      where: { id },
      relations: ['variant', 'user', 'supplier'],
    });
    if (!movement) throw new NotFoundException(`StockMovement ${id} not found`);
    return movement;
  }

  /** ✏️ Actualizar un movimiento */
  async update(id: string, dto: UpdateStockMovementDto) {
    await this.stockRepo.update(id, dto);
    return this.findOne(id);
  }

  /** 🗑️ Eliminar un movimiento */
  async remove(id: string) {
    const movement = await this.findOne(id);
    await this.stockRepo.remove(movement);
  }

  /** 🚨 Obtener alertas activas */
  async getActiveAlerts() {
    return this.alertRepo.find({
      where: { resolved: false },
      relations: ['variant'],
      order: { createdAt: 'DESC' },
    });
  }

  /** ✅ Resolver alerta (cuando se repone stock) */
  async resolveAlert(variantId: string) {
    const alerts = await this.alertRepo.find({
      where: { variant: { id: variantId }, resolved: false },
    });
    for (const alert of alerts) {
      alert.resolved = true;
      await this.alertRepo.save(alert);
    }
  }
}
