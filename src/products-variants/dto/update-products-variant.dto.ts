import { PartialType } from '@nestjs/swagger';
import { CreateProductsVariantDto } from './create-products-variant.dto';

export class UpdateProductsVariantDto extends PartialType(CreateProductsVariantDto) {}
