import { IsUUID, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsUUID()
  paidByUserId: string;

  notes?: string;
}

