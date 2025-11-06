import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/users/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  // AuthService.register()
async register(registerDto: RegisterDto) {
  const { email, password, name } = registerDto;

  if (!name) throw new BadRequestException('El nombre del usuario es requerido');

  // Hashear password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario (UsersService ya maneja el rol user)
  await this.usersService.create({
    name,
    email,
    password: hashedPassword,
    authMethodCheck: true,
  });

  return { message: 'Usuario registrado con éxito' };
}


  async login (loginDto:LoginDto){
    const {email, password} = loginDto;

    //primero hay que buscar el usuario en bd
    const user = await this.usersService.findByEmail(email); //metodo findByEmail 
    if (!user) {
      throw new BadRequestException('Email o Password invalido');
    }

    //verificar con bcrypt si la contraseña es valida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Email o Password invalido')
    }

    //generar token y firmarlo
    const payload = {sub: user.id, name: user.name, roles: user.roles?.map(r => r.name) };
    const token = this.jwtService.sign(payload);
  

  //devolvemos token
   return {
    access_token: token,
    user: {
      id: user.id,
      name: user.name,
      roles: user.roles
    },
  };
}
}