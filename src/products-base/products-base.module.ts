import { Module } from '@nestjs/common';
import { ProductsBaseService } from './products-base.service';
import { ProductsBaseController } from './products-base.controller';
import { ProductsBase } from './entities/products-base.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([ProductsBase])],
  controllers: [ProductsBaseController],
  providers: [ProductsBaseService],
})
export class ProductsBaseModule {}
