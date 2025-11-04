import { IsEmail, ValidateIf, IsNotEmpty, Validate } from 'class-validator';
import { PasswordOrClerkId } from 'src/common/validators/password-or-clerkId.validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ValidateIf(o => !o.clerkId)
  @IsNotEmpty({ message: 'Password is required if no clerkId is provided' })
  password?: string;

  @ValidateIf(o => !o.password)
  @IsNotEmpty({ message: 'clerkId is required if no password is provided' })
  clerkId?: string;

  // 👇 Valida que haya UNO y solo UNO de los dos--viene del validator que esta en common
  @Validate(PasswordOrClerkId)
  authMethodCheck: boolean;
}
