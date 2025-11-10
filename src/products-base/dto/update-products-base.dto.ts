import { PartialType } from '@nestjs/swagger';
import { CreateProductsBaseDto } from './create-products-base.dto';

export class UpdateProductsBaseDto extends PartialType(CreateProductsBaseDto) {}
