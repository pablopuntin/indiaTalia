// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Between } from 'typeorm';
// import { PriceRule } from './entities/price-rule.entity';
// import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
// import { PriceHistoryService } from 'src/price-history/price-history.service';

// @Injectable()
// export class PriceRulesService {
//   constructor(
//     @InjectRepository(PriceRule)
//     private readonly ruleRepo: Repository<PriceRule>,
//     @InjectRepository(ProductVariant)
//     private readonly variantRepo: Repository<ProductVariant>,
//     private readonly priceHistoryService: PriceHistoryService,
//   ) {}

//   async applyActiveRules() {
//     const now = new Date();
//     const rules = await this.ruleRepo.find({
//       where: { startDate: Between('2000-01-01', now), isActive: true },
//     });

//     for (const rule of rules) {
//       const variants = await this.variantRepo.find({
//         where: {
//           ...(rule.brand && { productBase: { brand: { id: rule.brand.id } } }),
//           ...(rule.category && { productBase: { category: { id: rule.category.id } } }),
//         },
//       });

//       for (const variant of variants) {
//         const oldPrice = variant.price;
//         const newPrice = +(oldPrice * (1 + rule.percentage / 100)).toFixed(2);
//         variant.price = newPrice;
//         await this.variantRepo.save(variant);

//         await this.priceHistoryService.recordChange({
//           variant,
//           oldPrice,
//           newPrice,
//           source: 'rule',
//           priceRule: rule,
//         });
//       }
//     }

//     return { message: 'Active price rules applied' };
//   }
// }

//refactor
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PriceRule } from './entities/price-rule.entity';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { PriceHistoryService } from 'src/price-history/price-history.service';

@Injectable()
export class PriceRulesService {
  constructor(
    @InjectRepository(PriceRule)
    private readonly ruleRepo: Repository<PriceRule>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly priceHistoryService: PriceHistoryService,
  ) {}

  async applyActiveRules() {
    const now = new Date();

    const rules = await this.ruleRepo.find({
      where: {
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
        isActive: true,
      },
      relations: ['brand', 'category'],
    });

    for (const rule of rules) {
      const where: any = {};
      if (rule.brand) where.productBase = { brand: { id: rule.brand.id } };
      if (rule.category) where.productBase = { category: { id: rule.category.id } };

      const variants = await this.variantRepo.find({ where });

      for (const variant of variants) {
        const oldPrice = variant.price;
        const newPrice = +(oldPrice * (1 + rule.percentage / 100)).toFixed(2);

        variant.price = newPrice;
        await this.variantRepo.save(variant);

        await this.priceHistoryService.recordChange({
          variant,
          oldPrice,
          newPrice,
          source: 'rule',
          priceRule: rule,
        });
      }
    }

    return { message: 'Active price rules applied successfully' };
  }
}

