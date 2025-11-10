import { Injectable, BadRequestException } from '@nestjs/common';
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

  async findAll() {
  return this.userRepository.find();
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

}
