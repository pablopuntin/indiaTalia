// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Category } from 'src/categories/entities/category.entity';
// import { Repository } from 'typeorm';
// import data from '../asset/data.json';

// @Injectable()
// export class InitialSeederCat implements OnModuleInit {
//   private readonly logger = new Logger(InitialSeederCat.name);

//   constructor(
//     @InjectRepository(Category)
//     private readonly categoryRepository: Repository<Category>,
//   ) {}

//   async onModuleInit() {
//     try {
//       this.logger.log('🚀 Inicializando categorías...');

//       for (const element of data as { name: string; description: string  }[]) {
//         const exists = await this.categoryRepository.findOne({
//           where: { name: element.name },
//         });

//         if (!exists) {
//           await this.categoryRepository.save(
//             this.categoryRepository.create({ 
//                 name: element.name,
//                 description: element.description
//             }),
//           );
//           this.logger.log(`✅ Categoría creada: ${element.name}`);
//         }
//       }

//       this.logger.log('🌱 Seed de categorías completado correctamente');
//     } catch (error) {
//       this.logger.error('❌ Error en el seeder de categorías:', error);
//     }
//   }
// }

//refactor
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import data from '../asset/data.json';

@Injectable()
export class InitialSeederCat implements OnModuleInit {
  private readonly logger = new Logger(InitialSeederCat.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('🚀 Inicializando categorías...');
      const list = (data as any).default ?? data;

      for (const element of list as { name: string; description: string }[]) {
        this.logger.debug(`Insertando: ${element.name} - ${element.description}`);
        
        const exists = await this.categoryRepository.findOne({
          where: { name: element.name },
        });

        if (!exists) {
          try {
            const saved = await this.categoryRepository.save(
              this.categoryRepository.create({
                name: element.name,
                description: element.description,
              }),
            );
            this.logger.log(`✅ Guardada categoría: ${saved.name}`);
          } catch (err) {
            this.logger.error(`❌ Error al guardar ${element.name}:`, err);
          }
        }
      }

      this.logger.log('🌱 Seed de categorías completado correctamente');
    } catch (error) {
      this.logger.error('❌ Error en el seeder de categorías:', error);
    }
  }
}
