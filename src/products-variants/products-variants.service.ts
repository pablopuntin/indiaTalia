import { Injectable } from '@nestjs/common';
import { CreateProductsVariantDto } from './dto/create-products-variant.dto';
import { UpdateProductsVariantDto } from './dto/update-products-variant.dto';

@Injectable()
export class ProductsVariantsService {
  create(createProductsVariantDto: CreateProductsVariantDto) {
    return 'This action adds a new productsVariant';
  }

  findAll() {
    return `This action returns all productsVariants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsVariant`;
  }

  update(id: number, updateProductsVariantDto: UpdateProductsVariantDto) {
    return `This action updates a #${id} productsVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsVariant`;
  }
}
