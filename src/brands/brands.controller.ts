import { Roles } from 'src/auth/decorators/roles.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthSwagger } from 'src/auth/decorators/auth-swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin,', 'admin')
     @ApiOperation({ summary: 'Crear nuevas categorias' })
   @Post()
   createBrand(@Body() createBrandDto: CreateBrandDto) {
     return this.brandsService.createBrand(createBrandDto);
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'Mostrar todas las categorias' })
   @Get()
   findAllBrand() {
     return this.brandsService.findAllBrand();
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'Mostrar categorias por id' })
   @Get(':id')
   findOne(@Param('id', ParseUUIDPipe) id: string) {
     return this.brandsService.findOne(id);
   }
 
    @AuthSwagger()
     @UseGuards(AuthGuard('jwt'), RolesGuard)
     @Roles('superadmin', 'admin')
     @ApiOperation({ summary: 'modificar marca' })
   @Patch(':id')
   update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBrandDto: UpdateBrandDto) {
     return this.brandsService.update(id, updateBrandDto);
   }
 
   @AuthSwagger()
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('superadmin')
   @ApiOperation({ summary: 'eliminar categorias' })
   @Delete(':id')
   remove(@Param('id', ParseUUIDPipe) id: string) {
     return this.brandsService.remove(id);
   }
}
