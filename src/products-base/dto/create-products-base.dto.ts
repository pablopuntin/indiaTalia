import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsBaseDto {
   @ApiProperty({
      description: 'Nombre del producto',
      example: 'Sahumerios',
       required: true
    })
  @IsString()
  name: string;

    @ApiProperty({
      description: 'descripcion del producto',
      example: 'Sahumerios en todas sus variantes',
       required: false
    })
  @IsOptional()
  @IsString()
  description?: string;

    @ApiProperty({
      description: 'Url de la imagen del producto',
      example: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg',
       required: false
    })
  @IsOptional()
  @IsUrl()
  imgURL: string;
}

