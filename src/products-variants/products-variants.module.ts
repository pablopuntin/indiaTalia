import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/products-variant.entity';
import { ProductsVariantsService } from './products-variants.service';
import { ProductsVariantsController } from './products-variants.controller';
import { ProductsBase } from 'src/products-base/entities/products-base.entity';
import { PriceHistoryModule } from 'src/price-history/price-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, ProductsBase]),
    forwardRef(() => PriceHistoryModule), // ✅ IMPORT NECESARIO
  ],
  controllers: [ProductsVariantsController],
  providers: [ProductsVariantsService],
  exports: [ProductsVariantsService],
})
export class ProductsVariantsModule {}
