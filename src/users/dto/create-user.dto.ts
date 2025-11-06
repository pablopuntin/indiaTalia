import { IsEmail, ValidateIf, IsNotEmpty, Validate, IsOptional } from 'class-validator';
import { PasswordOrClerkId } from 'src/common/validators/password-or-clerkId.validator';
import { Role } from '../entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  
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
}
