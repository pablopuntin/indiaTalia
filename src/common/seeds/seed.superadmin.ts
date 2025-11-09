//Preparado con .env para produccion mas adelante
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class InitialSeeder implements OnModuleInit {
  private readonly logger = new Logger(InitialSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('🚀 Inicializando roles y superadmin...');

      // 1️⃣ Crear roles base si no existen
      const baseRoles = ['superadmin', 'admin', 'user'];
      for (const name of baseRoles) {
        const exists = await this.roleRepository.findOne({ where: { name } });
        if (!exists) {
          await this.roleRepository.save(this.roleRepository.create({ name }));
          this.logger.log(`✅ Rol creado: ${name}`);
        }
      }

      // 2️⃣ Crear superadmin inicial si no existe
      const superadminEmail =
        process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
      const superadminPassword =
        process.env.SUPERADMIN_PASSWORD || 'SuperSecurePassword123!';

      const superadmin = await this.userRepository.findOne({
        where: { email: superadminEmail },
        relations: ['roles'], // ✅ OJO: debe coincidir con tu propiedad "roles" en la entidad
      });

      if (!superadmin) {
        const superRole = await this.roleRepository.findOne({
          where: { name: 'superadmin' },
        });

        if (!superRole) {
          throw new Error('❌ No se encontró el rol "superadmin".');
        }

        const passwordHash = await bcrypt.hash(superadminPassword, 10);

        const newSuperadmin = this.userRepository.create({
          email: superadminEmail,
          password: passwordHash,
          firstname: 'System',
          lastname: 'Admin',
          roles: [superRole],
        });

        await this.userRepository.save(newSuperadmin);
        this.logger.log(
          `✅ Superadmin creado: ${superadminEmail} (puedes cambiarlo en .env)`,
        );
      } else {
        this.logger.debug('ℹ️ Superadmin ya existe, no se crea otro.');
      }

      this.logger.log('🌱 Seed completado correctamente');
    } catch (error) {
      this.logger.error('❌ Error durante la inicialización de seeds:', error);
    }
  }
}