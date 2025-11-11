import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthSwagger } from 'src/auth/decorators/auth-swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

   @AuthSwagger()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin,', 'admin')
    @ApiOperation({ summary: 'Crear nuevas categorias' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

   @AuthSwagger()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin', 'admin')
    @ApiOperation({ summary: 'Mostrar todas las categorias' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

   @AuthSwagger()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin', 'admin')
    @ApiOperation({ summary: 'Mostrar categorias por id' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(+id);
  }

   @AuthSwagger()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    @ApiOperation({ summary: 'modificar categorias' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @AuthSwagger()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'eliminar categorias' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
  
  
}
