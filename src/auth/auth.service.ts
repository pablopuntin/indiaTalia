import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // 1️⃣ Verificamos si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // 2️⃣ Hasheamos el password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Creamos el usuario con rol por defecto (user)
    const user = await this.usersService.create({
        name: registerDto.name,
      email,
      password: hashedPassword,
        authMethodCheck: true,
    });

    // 4️⃣ Devolvemos una respuesta simple
    return {
      message: 'User registered successfully',
         };
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