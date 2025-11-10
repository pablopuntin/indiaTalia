// import { Brand } from "src/brands/entities/brand.entity";
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";



// @Entity({ name: 'productBase'})
// export class ProductsBase {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ type: 'varchar', length: 50 })
//     name: string;

//     @Column({ type: 'text' })
//     description: string;

    
//       // ✅ Muchas marcas pertenecen a una categoría
//       @ManyToOne(() => Brand, (brand) => brand.productsBase)
//       @JoinColumn({ name: 'products_base_id' })
//       brand: Brand;
    
// }

//refactor
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Brand } from "src/brands/entities/brand.entity";
import { ProductVariant } from "src/products-variants/entities/products-variant.entity";

@Entity({ name: 'product_base' })
export class ProductsBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  // ✅ Muchos productos base pertenecen a una marca
  @ManyToOne(() => Brand, (brand) => brand.productsBase, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // ✅ Un producto base tiene muchas variantes
@OneToMany(() => ProductVariant, (variant) => variant.productBase)
  variants: ProductVariant[];
}
