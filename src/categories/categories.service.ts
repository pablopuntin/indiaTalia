import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { find } from 'rxjs';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>){}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    const categories = await this.categoryRepository.find();

     return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
  }));
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

   async update(id: string, updateCategoryDto: UpdateCategoryDto) {
   const category = await this.categoryRepository.findOne({where: {id}});

     if (!category){
       throw new NotFoundException('No se encontro el usuario con el id "{id}');
     }

     const updated = Object.assign(category, updateCategoryDto);
     const savedCategory = await this.categoryRepository.save(updated);

     return category;
   }

//   async remove(id: string) {
//   const category = await this.categoryRepository.findOne({
//     where: { id },
//     relations: ['brands', 'brands.products', 'brands.products.variants'],
//   });

//   if (!category) throw new NotFoundException('Categoría no encontrada');

//   // Desactivar la categoría
//   category.isActive = false;
//   await this.categoryRepository.save(category);

//   // Desactivar solo los productos dentro de esa categoría
//   for (const brand of category.brands) {
//     for (const product of brand.productsBase) {
//       // Si el producto pertenece a esta categoría, lo desactivamos
//       if (productBase.category.id === category.id) {
//         product.isActive = false;
//         for (const variant of product.variants) {
//           variant.isActive = false;
//           await this.categoryRepository.manager.save(variant);
//         }
//         await this.categoryRepository.manager.save(product);
//       }
//     }
//   }

//   return { message: `Categoría ${category.name} desactivada` };
// }

//refactor
async remove(id: string) {
  const category = await this.categoryRepository.findOne({
    where: { id },
    relations: [
      'brands',
      'brands.categories',
      'brands.productsBase',
      'brands.productsBase.variants',
    ],
  });

  if (!category) throw new NotFoundException('Categoría no encontrada');

  // 🔸 Desactivar la categoría
  category.isActive = false;
  await this.categoryRepository.save(category);

  // 🔸 Revisar cada marca asociada
  for (const brand of category.brands) {
    // Quitamos la relación entre la categoría y la marca
    brand.categories = brand.categories.filter((c) => c.id !== category.id);

    // Si la marca ya no pertenece a ninguna categoría → desactivarla
    if (brand.categories.length === 0) {
      brand.isActive = false;
      await this.categoryRepository.manager.save(brand);

      // Desactivar sus productos y variantes
      for (const productBase of brand.productsBase) {
        productBase.isActive = false;
        await this.categoryRepository.manager.save(productBase);

        for (const variant of productBase.variants) {
          variant.isActive = false;
          await this.categoryRepository.manager.save(variant);
        }
      }
    } else {
      // Si la marca todavía pertenece a otras categorías, solo actualizamos sus relaciones
      await this.categoryRepository.manager.save(brand);
    }
  }

  return { message: `Categoría "${category.name}" desactivada correctamente.` };
}


}
