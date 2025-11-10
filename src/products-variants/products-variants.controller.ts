import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsVariantsService } from './products-variants.service';
import { CreateProductsVariantDto } from './dto/create-products-variant.dto';
import { UpdateProductsVariantDto } from './dto/update-products-variant.dto';

@Controller('products-variants')
export class ProductsVariantsController {
  constructor(private readonly productsVariantsService: ProductsVariantsService) {}

  @Post()
  create(@Body() createProductsVariantDto: CreateProductsVariantDto) {
    return this.productsVariantsService.create(createProductsVariantDto);
  }

  @Get()
  findAll() {
    return this.productsVariantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsVariantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsVariantDto: UpdateProductsVariantDto) {
    return this.productsVariantsService.update(+id, updateProductsVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsVariantsService.remove(+id);
  }
}
