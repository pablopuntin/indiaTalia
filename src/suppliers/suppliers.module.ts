import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierProduct } from './entities/supplier-product.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Supplier, SupplierProduct])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
