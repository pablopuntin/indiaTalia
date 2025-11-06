import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El Email debe ser valido' })
  email: string;

  @IsNotEmpty({ message: 'El Password mo puede estar vacio' })
  @MinLength(6, { message: 'El Password debe tener al menos 6 caracteres' })
  password: string;
}
