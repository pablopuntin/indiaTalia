import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductVariant } from "./entities/products-variant.entity";
import { CreateProductVariantDto } from "./dto/create-products-variant.dto";
import { UpdateProductsVariantDto } from "./dto/update-products-variant.dto";
import { ProductsBase } from "src/products-base/entities/products-base.entity";
import { PriceHistoryService } from "src/price-history/price-history.service";

@Injectable()
export class ProductsVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(ProductsBase)
    private readonly baseRepo: Repository<ProductsBase>,
    private readonly priceHistoryService: PriceHistoryService,
    
  ) {}

  async create(dto: CreateProductVariantDto) {
    const base = await this.baseRepo.findOne({ where: { id: dto.productBaseId } });
    if (!base) throw new NotFoundException("Producto base no encontrado");

    const variant = this.variantRepo.create({
      ...dto,
      productBase: base,
    });

    return await this.variantRepo.save(variant);
  }

  async findAll() {
    return await this.variantRepo.find({
      relations: ["productBase"],
      order: { name: "ASC" },
    });
  }

  async findOne(id: string) {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: ["productBase", "supplierProducts"],
    });
    if (!variant) throw new NotFoundException("Variante no encontrada");
    return variant;
  }

   async update(id: string, dto: UpdateProductsVariantDto, user?: any) {
    const variant = await this.variantRepo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variante con id ${id} no encontrada`);

    const oldPrice = variant.price;

    // Actualizamos los campos
    Object.assign(variant, dto);
    const updated = await this.variantRepo.save(variant);

    // Si el precio cambió, registramos el cambio
    if (dto.price && dto.price !== oldPrice) {
      await this.priceHistoryService.recordChange({
        variant,
        oldPrice,
        newPrice: dto.price,
        changedBy: user ?? null,
        source: 'manual', // Podés poner 'rule' si vino desde una PriceRule
      });
    }

    return updated;
  }

  async remove(id: string) {
  const variant = await this.variantRepo.findOne({ where: { id } });
  if (!variant) throw new NotFoundException(`Variante con id ${id} no encontrada`);

  variant.isActive = false;
  await this.variantRepo.save(variant);

  return { message: `Variante ${variant.name} desactivada correctamente` };
}

 
}