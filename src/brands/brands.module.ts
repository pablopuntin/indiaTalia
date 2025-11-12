import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { InitialSeederBrand } from 'src/common/seeds/seed.brands';

@Module({
   imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService, InitialSeederBrand],
})
export class BrandsModule {}
