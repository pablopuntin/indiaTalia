import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { PriceChangeHistory } from 'src/price-history/entities/price-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant, PriceChangeHistory])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
