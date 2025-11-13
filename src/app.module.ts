import { ProductImagesModule } from './product-image/product-image.module';
import { StockModule } from './stock/stock.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/config/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { ProductsVariantsModule } from './products-variants/products-variants.module';
import { ProductsBaseModule } from './products-base/products-base.module';
import { BrandsModule } from './brands/brands.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { PriceRulesModule } from './price-rules/price-rules.module';
import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true, // ✅ lo hace disponible en toda la app
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    SuppliersModule,
    ProductsBaseModule,
    ProductsVariantsModule,
    BrandsModule,
    SuppliersModule,
    StockModule,
    ProductImagesModule,
    PriceHistoryModule,
    PriceRulesModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}import { from } from 'rxjs';


