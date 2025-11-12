import { Injectable } from '@nestjs/common';
import { CreateProductsBaseDto } from './dto/create-products-base.dto';
import { UpdateProductsBaseDto } from './dto/update-products-base.dto';

@Injectable()
export class ProductsBaseService {
  create(createProductsBaseDto: CreateProductsBaseDto) {
    return 'This action adds a new productsBase';
  }

  findAll() {
    return `This action returns all productsBase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsBase`;
  }

  update(id: string, updateProductsBaseDto: UpdateProductsBaseDto) {
    return `This action updates a #${id} productsBase`;
  }

  remove(id: string) {
    return `This action removes a #${id} productsBase`;
  }
}
