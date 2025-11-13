import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierProduct } from './entities/supplier-product.entity';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierProduct, ProductVariant])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
