import { IsEmail, 
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
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreateUserDto {
   @ApiProperty({
      description: 'Nombre',
      example: 'Juan',
    })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
      description: 'Apellido',
      example: 'Perez',
    })  
  @IsNotEmpty()
  lastname: string;
  
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ValidateIf(o => !o.clerkId)
  @IsOptional()
  password?: string;

    @IsOptional()
  role?: Role;

  @ValidateIf(o => !o.password)
  @IsNotEmpty({ message: 'clerkId is required if no password is provided' })
  clerkId?: string;

  // 👇 Valida que haya UNO y solo UNO de los dos--viene del validator que esta en common
  @Validate(PasswordOrClerkId)
  authMethodCheck: boolean;


  // 👇 Datos opcionales para e-commerce
  @IsOptional()
  @IsPhoneNumber('AR', { message: 'Phone number must be valid for Argentina' })
  phone?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsPostalCode('any', { message: 'Postal code must be valid' })
  postalCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender?: Gender;
}
