import { Roles } from 'src/auth/decorators/roles.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthSwagger } from 'src/auth/decorators/auth-swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductsBaseDto } from './dto/create-products-base.dto';
import { ProductsBaseService } from './products-base.service';
import { UpdateProductsBaseDto } from './dto/update-products-base.dto';

@Controller('brands')
export class ProductsBaseController {
  constructor(private readonly productsBaseService: ProductsBaseService) {}

  @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin,', 'admin')
     @ApiOperation({ summary: 'Crear nuevas categorias' })
   @Post()
   create(@Body() createProductsBaseDto: CreateProductsBaseDto) {
     return this.productsBaseService.create(createProductsBaseDto);
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'Mostrar todas las categorias' })
   @Get()
   findAll() {
     return this.productsBaseService.findAll();
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'Mostrar categorias por id' })
   @Get(':id')
   findOne(@Param('id', ParseUUIDPipe) id: string) {
     return this.productsBaseService.findOne(+id);
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'modificar marca' })
   @Patch(':id')
   update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductsBaseDto: UpdateProductsBaseDto) {
     return this.productsBaseService.update(id, updateProductsBaseDto);
   }
 
   @AuthSwagger()
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('superadmin')
   @ApiOperation({ summary: 'eliminar categorias' })
   @Delete(':id')
   remove(@Param('id', ParseUUIDPipe) id: string) {
     return this.productsBaseService.remove(id);
   }
}
