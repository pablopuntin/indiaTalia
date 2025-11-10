import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsBaseService } from './products-base.service';
import { CreateProductsBaseDto } from './dto/create-products-base.dto';
import { UpdateProductsBaseDto } from './dto/update-products-base.dto';

@Controller('products-base')
export class ProductsBaseController {
  constructor(private readonly productsBaseService: ProductsBaseService) {}

  @Post()
  create(@Body() createProductsBaseDto: CreateProductsBaseDto) {
    return this.productsBaseService.create(createProductsBaseDto);
  }

  @Get()
  findAll() {
    return this.productsBaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsBaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsBaseDto: UpdateProductsBaseDto) {
    return this.productsBaseService.update(+id, updateProductsBaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsBaseService.remove(+id);
  }
}
