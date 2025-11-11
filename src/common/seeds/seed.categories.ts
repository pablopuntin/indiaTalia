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

      // Normalizamos la data (por si viene en default)
      const list = (data as any).default ?? data;

      // Pasamos todos los nombres a mayúsculas antes de comparar
      const normalizedList = (list as { name: string; description: string }[]).map(
        (el) => ({
          name: el.name.trim().toUpperCase(),
          description: el.description ? el.description.trim().toUpperCase() : '',
        }),
      );

      // Obtenemos todas las categorías existentes
      const existing = await this.categoryRepository.find();
      const existingNames = existing.map((c) => c.name.toUpperCase());

      // Si ya están todas cargadas, cancelamos
      const allExist = normalizedList.every((el) => existingNames.includes(el.name));
      if (allExist) {
        this.logger.log('✅ Todas las categorías ya existen. Seed detenido.');
        return;
      }

      // Si faltan algunas, insertamos solo las nuevas
      for (const element of normalizedList) {
        if (!existingNames.includes(element.name)) {
          try {
            const saved = await this.categoryRepository.save(
              this.categoryRepository.create({
                name: element.name,
                description: element.description,
              }),
            );
            this.logger.log(`🌱 Creada categoría: ${saved.name}`);
          } catch (err) {
            this.logger.error(`❌ Error al guardar ${element.name}: ${err.message}`);
          }
        } else {
          this.logger.debug(`↩️ Ya existe: ${element.name}`);
        }
      }

      this.logger.log('🌿 Seed de categorías completado correctamente');
    } catch (error) {
      this.logger.error('❌ Error en el seeder de categorías:', error);
    }
  }
}
