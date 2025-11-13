// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { StockService } from './stock.service';
// import { StockController } from './stock.controller';
// import { StockMovement } from './entities/stock.entity';
// import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
// import { Supplier } from 'src/suppliers/entities/supplier.entity';
// import { User } from 'src/users/entities/user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([StockMovement, ProductVariant, Supplier, User])],
//   controllers: [StockController],
//   providers: [StockService],
//   exports: [StockService],
// })
// export class StockModule {}

//refactor
// src/stock/stock.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockMovement } from './entities/stock.entity';
import { StockAlert } from './entities/stock-alert.entity'; // 👈 la nueva entidad
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovement,
      StockAlert, // 👈 agrega esta línea
      ProductVariant,
      Supplier,
      User,
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
