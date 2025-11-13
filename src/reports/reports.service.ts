import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { PriceChangeHistory } from 'src/price-history/entities/price-history.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(PriceChangeHistory)
    private readonly priceHistoryRepo: Repository<PriceChangeHistory>,
  ) {}

  async getStockSummary() {
    const variants = await this.variantRepo.find();
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    return {
      totalVariants: variants.length,
      totalStock,
      lowStock: variants.filter((v) => v.stock < 5).length,
    };
  }

  async getPriceChanges({ from, to }: { from?: string; to?: string }) {
    const where = from && to ? { changedAt: Between(new Date(from), new Date(to)) } : {};
    return this.priceHistoryRepo.find({ where, order: { changedAt: 'DESC' } });
  }
}
