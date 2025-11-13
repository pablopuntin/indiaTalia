import { IsUUID, IsNumber, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateSupplierProductDto {
  @IsUUID()
  supplierId: string;

  @IsUUID()
  variantId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  purchasePrice: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  specialNotes?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;
}
