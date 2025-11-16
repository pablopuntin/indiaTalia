import { 
  IsEmail, 
  ValidateIf, 
  IsNotEmpty, 
  Validate, 
  IsOptional, 
  IsPhoneNumber, 
  IsDateString, 
  IsString,
  IsPostalCode,
  IsEnum,
} from 'class-validator';
import { PasswordOrClerkId } from 'src/common/validators/password-or-clerkId.validator';
import { Role } from '../entities/role.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Perez',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'juanperez@mail.com',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiPropertyOptional({
    description: 'Contraseña (obligatoria si no se envía clerkId)',
    example: 'mySecurePassword123',
  })
  @ValidateIf(o => !o.clerkId)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Rol asignado al usuario',
    type: () => Role,
  })
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: 'ID del usuario en proveedor externo (obligatorio si no hay password)',
    example: 'user_clerk_abc123',
  })
  @ValidateIf(o => !o.password)
  @IsNotEmpty({ message: 'clerkId is required if no password is provided' })
  clerkId?: string;

  @ApiProperty({
    description: 'Se valida que exista password O clerkId, pero no ambos',
    example: true,
  })
  @Validate(PasswordOrClerkId)
  authMethodCheck: boolean;

  // -------- OPCIONALES DE E-COMMERCE --------

  @ApiPropertyOptional({
    description: 'Número de teléfono (Argentina)',
    example: '+54 9 11 1234 5678',
  })
  @IsOptional()
  @IsPhoneNumber('AR', { message: 'Phone number must be valid for Argentina' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección línea 1',
    example: 'Av. Siempre Viva 742',
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({
    description: 'Dirección línea 2',
    example: 'Depto 3B',
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({
    description: 'Ciudad',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Estado o provincia',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'País',
    example: 'Argentina',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '1414',
  })
  @IsOptional()
  @IsPostalCode('any', { message: 'Postal code must be valid' })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento (ISO string)',
    example: '1990-05-20',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Género del usuario',
    example: 'male',
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender?: Gender;
}
