// import { DataSource } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { Role } from 'src/users/entities/role.entity';
// import { User } from '../../users/entities/user.entity';
// import { AppDataSource } from '../data-source'; // tu configuración TypeORM

// async function seed() {
//   const dataSource: DataSource = await AppDataSource.initialize();

//   const roleRepo = dataSource.getRepository(Role);
//   const userRepo = dataSource.getRepository(User);

//   // Crear roles base
//   const roles = ['superadmin', 'admin', 'user'];
//   for (const name of roles) {
//     const exists = await roleRepo.findOne({ where: { name } });
//     if (!exists) {
//       const role = roleRepo.create({ name });
//       await roleRepo.save(role);
//     }
//   }

//   // Crear superadmin si no existe
//   const superadminEmail = 'superadmin@example.com';
//   const superadmin = await userRepo.findOne({
//     where: { email: superadminEmail },
//     relations: ['role'],
//   });

//   if (!superadmin) {
//     const superRole = await roleRepo.findOne({ where: { name: 'superadmin' } });
//     const passwordHash = await bcrypt.hash('SuperSecurePassword123!', 10);
//     const newSuperadmin = userRepo.create({
//       email: superadminEmail,
//       password: passwordHash,
//       role: superRole,
//     });
//     await userRepo.save(newSuperadmin);
//     console.log('✅ Superadmin creado:', superadminEmail);
//   } else {
//     console.log('ℹ️ Superadmin ya existe.');
//   }

//   await dataSource.destroy();
// }

// seed()
//   .then(() => console.log('✅ Seed completado'))
//   .catch((err) => console.error('❌ Error en seed:', err));
