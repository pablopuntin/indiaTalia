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


@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true, // ✅ lo hace disponible en toda la app
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60m' },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    SuppliersModule,
    ProductsBaseModule,
    ProductsVariantsModule,
    BrandsModule,
    SuppliersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}import { from } from 'rxjs';

