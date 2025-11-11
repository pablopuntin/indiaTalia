import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ProductsBase } from "src/products-base/entities/products-base.entity";
// import { ProductImage } from "src/product-images/entities/product-image.entity"; // si la crearás después
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'productvariants' })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // Ej: "Lavanda 250ml" o "Vainilla 500ml"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size?: string;

  @Column({
    type: 'text',
    default: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg',
  })
  imgURL: string;

  @ApiProperty({
      example: true,
      description: 'Indica si el usuario está activo en el sistema',
    })
    @Column({ default: true })
    isActive: boolean;

  // ✅ Muchas variantes pertenecen a un producto base
  @ManyToOne(() => ProductsBase, (productBase) => productBase.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_base_id' })
  productBase: ProductsBase;

  // ✅ Una variante podría tener varias imágenes (si decides manejar múltiples)
  // @OneToMany(() => ProductImage, (image) => image.variant)
  // images: ProductImage[];
}
