import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

    const user = this.userRepository.create({
      firstname,
      lastname,
      email,
      password,
      ...(clerkId && { clerkId }), // solo lo incluye si existe
      roles: [defaultRole],
    });

    return this.userRepository.save(user);
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

async remove(id: string) {
  const user = await this.findOne(id);
  if (!user) throw new Error('User not found');
  return this.userRepository.remove(user);
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
