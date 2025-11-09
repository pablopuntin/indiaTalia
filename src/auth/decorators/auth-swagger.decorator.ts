import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Decorador para marcar endpoints protegidos en Swagger.
 * 
 * - Añade el esquema Bearer (JWT) a la documentación de la ruta.
 * - Muestra una descripción en caso de error 401.
 * - No afecta la lógica real de autenticación, solo documentación.
 */
export function AuthSwagger() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'), // 🔗 Debe coincidir con el nombre del esquema definido en main.ts
    ApiUnauthorizedResponse({
      description: 'Debe incluir un token JWT válido en el encabezado Authorization.',
    }),
  );
}



//EJEMPLO DE COMO USAR LOS DECORADORES DE AUTH
// import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
// import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { AuthSwagger } from 'src/common/decorators/auth-swagger.decorator';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { ProductService } from './products.service';

// @ApiTags('Products')
// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productService: ProductService) {}

//   @AuthSwagger() // 👈 Documenta que esta ruta necesita JWT
//   @ApiOperation({ summary: 'Actualizar un producto (solo Admin)' })
//   @ApiBody({ type: UpdateProductDto })
//   @UseGuards(JwtAuthGuard, RolesGuard) // 🔐 Valida token y roles
//   @Roles('superAdmin')
//   @Put(':id')
//   updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
//     return this.productService.updateProduct(id, dto);
//   }
// }
