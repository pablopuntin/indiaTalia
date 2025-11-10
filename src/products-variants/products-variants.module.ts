import { Module } from '@nestjs/common';
import { ProductsVariantsService } from './products-variants.service';
import { ProductsVariantsController } from './products-variants.controller';
import { ProductVariant } from './entities/products-variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductsVariantsController],
  providers: [ProductsVariantsService],
})
export class ProductsVariantsModule {}
