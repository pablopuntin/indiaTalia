import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

 
 async create(createUserDto: CreateUserDto) {
  const { email, password, firstname, lastname, clerkId } = createUserDto;

  const existing = await this.userRepository.findOne({ where: { email } });
  if (existing) throw new BadRequestException('Email already exists');

  const defaultRole = await this.roleRepository.findOne({ where: { name: 'user' } });
  if (!defaultRole) throw new BadRequestException('Default role "user" not found');

  // Si tiene password → hash
  let hashedPassword: string | undefined = undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = this.userRepository.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,   // ✔ ahora sí lo guardamos hasheado
    ...(clerkId && { clerkId }),
    roles: [defaultRole],
  });

 const saved = await this.userRepository.save(user);

  // 🔥 sólo devolvés lo que querés
  const { id } = saved;
  return { id, firstname, lastname };
}



  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

 async findAll (page: number, limit: number){
  //Parseo page y limit porque llegan com string del front
    const skip = (page-1)* limit;
    const users = await this.userRepository.find({

      //take y skip son propiedades de BD 
      take: limit,
      skip: skip,
    });
    return users.map(({password,  ...filteredUserData})=> filteredUserData);
  }

  
async findOne(id: string) {
  return this.userRepository.findOne({ where: { id } });
}

async update(id: string, updateUserDto: any) {
  await this.userRepository.update(id, updateUserDto);
  return this.findOne(id);
}

// async remove(id: string) {
//   const user = await this.findOne(id);
//   if (!user) throw new Error('User not found');
//   return this.userRepository.remove(user);
// }

//refactor soft deleted y solo uno puede eliminar su user
async remove(id: string, currentUser: User) {
  const user = await this.userRepository.findOne({
    where: { id },
    withDeleted: false,
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const hasRole = (u: User, role: string) =>
    u.roles.some(r => r.name === role);

  const isSelf = currentUser.id === user.id;

  const targetIsSuperadmin = hasRole(user, 'superadmin');
  const targetIsAdmin = hasRole(user, 'admin');

  const currentIsSuperadmin = hasRole(currentUser, 'superadmin');
  const currentIsAdmin = hasRole(currentUser, 'admin');

  // 🚫 1. Nadie puede eliminar a un superadmin
  if (targetIsSuperadmin) {
    throw new BadRequestException('Superadmins cannot be deleted');
  }

  // ✔️ 2. Un superadmin puede eliminar a cualquiera (excepto superadmin, ya bloqueado arriba)
  if (currentIsSuperadmin) {
    await this.userRepository.softDelete(id);
    return { message: 'User deleted by superadmin', id };
  }

  // ✔️ 3. Un usuario puede eliminarse a sí mismo
  if (isSelf) {
    await this.userRepository.softDelete(id);
    return { message: 'User deleted itself', id };
  }

  // ✔️ 4. Admin puede eliminar usuarios normales
  // if (currentIsAdmin && !targetIsAdmin) {
  //   await this.userRepository.softDelete(id);
  //   return { message: 'User deleted by admin', id };
  // }

  // 🚫 5. Todo lo demás prohibido
  throw new BadRequestException('Not allowed to delete this user');
}


async makeAdmin(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`No existe usuario con id ${id}`);
    }

    // Buscar el rol de admin
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      throw new BadRequestException(
        'No existe el rol "admin" en la base de datos. Debe crearse primero.',
      );
    }

    // Verificar si ya tiene ese rol
    const alreadyAdmin = user.roles.some((r) => r.name === 'admin');
    if (alreadyAdmin) {
      throw new BadRequestException('El usuario ya tiene el rol de administrador.');
    }

    // Agregar el rol admin
    user.roles.push(adminRole);
    const updatedUser = await this.userRepository.save(user);

    // Remover password antes de devolver
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }
}
