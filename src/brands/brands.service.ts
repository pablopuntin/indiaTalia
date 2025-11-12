//import { BrandsService } from './brands.service';
// import { Injectable } from '@nestjs/common';
// import { CreateBrandDto } from './dto/create-brand.dto';
// import { UpdateBrandDto } from './dto/update-brand.dto';

// @Injectable()
// export class BrandsService {
//   create(createBrandDto: CreateBrandDto) {
//     return 'This action adds a new brand';
//   }

//   findAll() {
//     return `This action returns all brands`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} brand`;
//   }

//   update(id: number, updateBrandDto: UpdateBrandDto) {
//     return `This action updates a #${id} brand`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} brand`;
//   }
// }


//Funciones del crud

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class BrandsService {
  constructor(
      @InjectRepository(Brand)
      private readonly brandRepository: Repository<Brand>) {}

  create(createBrandDto: CreateBrandDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    const brand = await this.brandRepository.find();

     return brand.map(brand => ({
    id: brand.id,
    name: brand.name,
    description: brand.description,
  }));
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

   async update(id: string, updateBrandDto: UpdateBrandDto) {
   const category = await this.brandRepository.findOne({where: {id}});

     if (!category){
       throw new NotFoundException('No se encontro el usuario con el id "{id}');
     }

     const updated = Object.assign(category, updateBrandDto);
     const savedCategory = await this.brandRepository.save(updated);

     return category;
   }


async remove(id: string) {
  // 1️⃣ Buscar la marca con sus relaciones
  const brand = await this.brandRepository.findOne({
    where: { id },
    relations: [
      'categories',
      'productsBase',
      'productsBase.variants',
    ],
  });

  if (!brand) {
    throw new NotFoundException(`La marca con id ${id} no existe`);
  }

  // 2️⃣ Desactivar la marca
  brand.isActive = false;
  await this.brandRepository.save(brand);

  // 3️⃣ Desactivar todos los productos base de la marca
  for (const productBase of brand.productsBase) {
    productBase.isActive = false;
    await this.brandRepository.manager.save(productBase);

    // 4️⃣ Desactivar todas las variantes de cada producto base
    for (const variant of productBase.variants) {
      variant.isActive = false;
      await this.brandRepository.manager.save(variant);
    }
  }

  return { message: `Marca "${brand.name}" desactivada correctamente.` };
}

  

}
