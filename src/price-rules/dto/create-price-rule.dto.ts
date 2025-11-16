import { IsString, IsBoolean, IsOptional, IsUUID, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceRuleDto {
  @ApiProperty({
    description: 'Nombre de la regla de precios',
    example: 'Aumento de temporada',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Porcentaje de ajuste (positivo o negativo)',
    example: 10.5,
  })
  @IsNumber()
  percentage: number;

  @ApiProperty({
    description: 'Fecha de inicio de la regla',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de fin de la regla',
    example: '2025-01-31T23:59:59.000Z',
  })
  @IsDateString()
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Indica si la regla está activa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'ID de la marca',
    example: '47fb5e4a-a70c-4f5d-b6a8-4d994a9c1234',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría',
    example: 'c79ba71c-e878-4e10-9ed6-bef2d2021234',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario creador',
    example: 'a3c8faef-29d6-4f33-945d-514231231234',
  })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}

