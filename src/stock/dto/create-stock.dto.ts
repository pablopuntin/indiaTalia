import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { StockMovementType } from '../entities/stock.entity';

export class CreateStockMovementDto {
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsInt()
  quantity: number;

  @IsUUID()
  variantId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
