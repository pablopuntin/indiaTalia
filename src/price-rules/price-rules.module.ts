// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PriceRulesService } from './price-rules.service';
// import { PriceRulesController } from './price-rules.controller';
// import { PriceRule } from './entities/price-rule.entity';
// import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
// import { PriceHistoryModule } from 'src/price-history/price-history.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([PriceRule, ProductVariant]),
//     PriceHistoryModule,
//   ],
//   controllers: [PriceRulesController],
//   providers: [PriceRulesService],
// })
// export class PriceRulesModule {}

//refactor
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceRulesService } from './price-rules.service';
import { PriceRulesController } from './price-rules.controller';
import { PriceRule } from './entities/price-rule.entity';
import { ProductVariant } from 'src/products-variants/entities/products-variant.entity';
import { PriceHistoryModule } from 'src/price-history/price-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceRule, ProductVariant]),
    forwardRef(() => PriceHistoryModule),
  ],
  controllers: [PriceRulesController],
  providers: [PriceRulesService],
  exports: [PriceRulesService],
})
export class PriceRulesModule {}
