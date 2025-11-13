import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductsVariantsService } from "./products-variants.service";
import { CreateProductVariantDto } from "./dto/create-products-variant.dto";
import { UpdateProductsVariantDto } from "./dto/update-products-variant.dto";

@ApiTags("Product Variants")
@Controller("product-variants")
export class ProductsVariantsController {
  constructor(private readonly variantsService: ProductsVariantsService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva variante de producto" })
  create(@Body() dto: CreateProductVariantDto) {
    return this.variantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas las variantes de productos" })
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una variante por ID" })
  findOne(@Param("id") id: string) {
    return this.variantsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar una variante" })
  update(@Param("id") id: string, @Body() dto: UpdateProductsVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desactivar una variante (borrado lógico)" })
  remove(@Param("id") id: string) {
    return this.variantsService.remove(id)
  }
}
