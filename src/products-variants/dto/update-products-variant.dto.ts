import { PartialType } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-products-variant.dto';

export class UpdateProductsVariantDto extends PartialType(CreateProductVariantDto) {}
