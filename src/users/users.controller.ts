import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthSwagger } from 'src/auth/decorators/auth-swagger.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParseUUIDPipe } from '@nestjs/common';
import { User } from './entities/user.entity';


@ApiTags('Users') // 👈 Esto hace que Swagger la agrupe
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthSwagger()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @ApiOperation({summary: 'Crear usuarios'})
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  
  //refactor
  @AuthSwagger()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Mostrar todos los usuarios' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de usuarios por página (por defecto 5)',
    example: 5,
  })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (page && limit) {
      return this.usersService.findAll(Number(page), Number(limit));
    }
    return this.usersService.findAll(1, 5);
  }


  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @AuthSwagger()
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Eliminar un usuario' })
@Delete(':id')
remove(
  @Param('id', ParseUUIDPipe) id: string,
  @Req() req,
) {
  const currentUser = req.user; // viene del JWT
  return this.usersService.remove(id, currentUser);
}


//hacer admin
   @AuthSwagger()
@UseGuards(AuthGuard('jwt'))
@Roles('superadmin', 'admin', 'user')
@ApiOperation({ summary: 'Dar rol de administrador a un usuario' })
@Put(':id/makeAdmin')
makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
  return this.usersService.makeAdmin(id);
}
}
