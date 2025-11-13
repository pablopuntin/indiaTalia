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

 async createBrand(createBrandDto: CreateBrandDto) {
   const nameUpper = createBrandDto.name.toUpperCase();
   const descriptionUpper = createBrandDto.description?.toUpperCase();
 
   // Verificamos duplicados en categorías
   const existing = await this.brandRepository.findOne({
     where: { name: nameUpper },
   });
   if (existing) {
     throw new Error(`La categoría ${nameUpper} ya existe`);
   }
 
   // Creamos nueva categoría
   const newCategory = new Category();
   newCategory.name = nameUpper;
   if (descriptionUpper) {
     newCategory.description = descriptionUpper;
   }
 
   await this.brandRepository.save(newCategory);
 
   return 'Marca creada';
 }

 async findAllBrand() {
  const brands = await this.brandRepository.find();
  
  return brands.map(b => ({
    id: b.id,
    name: b.name,
    description: b.description,
  }));
}


  async findOne(id: string) {
    const variant = await this.brandRepository.findOne({
      where: { id },
      relations: ["productBase", "supplierProducts"],
    });
    if (!variant) throw new NotFoundException("Variante no encontrada");
    return variant;
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
