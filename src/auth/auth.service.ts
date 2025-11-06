import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
      email,
      password: hashedPassword,
        authMethodCheck: true,
    });

    // 4️⃣ Devolvemos una respuesta simple
    return {
      message: 'User registered successfully',
         };
  }

  async login (login:LoginDto){
    return "login ok";
  }
}
