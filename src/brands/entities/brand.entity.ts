// import { Brand } from 'src/brands/entities/brand.entity';
// import { ProductsBase } from './../../products-base/entities/products-base.entity';
// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
// import { Category } from "src/categories/entities/category.entity";


// @Entity({ name: 'brands' })
// export class Brand {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 100 })
//   name: string;


//   @Column({type:'text', 
//     default: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg'})
//   imgURL: string;


//   // ✅ Muchas marcas pertenecen a una categoría
//   @ManyToOne(() => Category, (category) => category.brands)
//   @JoinColumn({ name: 'category_id' })
//   category: Category;

//     // ✅ 1 marca tiene muchos productosBases
//     @OneToMany(() => ProductsBase, (productsBase) => ProductsBase.brand)
//     productsBase: ProductsBase[];
// }

//refactor
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Category } from "src/categories/entities/category.entity";
import { ProductsBase } from "src/products-base/entities/products-base.entity";

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'text',
    default: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg',
  })
  imgURL: string;

  // ✅ Muchas marcas pertenecen a una categoría
  @ManyToOne(() => Category, (category) => category.brands, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // ✅ Una marca tiene muchos productos base
  @OneToMany(() => ProductsBase, (productBase) => productBase.brand)
  productsBase: ProductsBase[];
}
