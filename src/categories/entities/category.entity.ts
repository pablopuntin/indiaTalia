// // import { ApiProperty } from "@nestjs/swagger";
// // import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
// // import { Brand } from "src/brands/entities/brand.entity";

// // @Entity({ name: 'categories'})

// // export class Category {

// //     @PrimaryGeneratedColumn('uuid')
// //     id: string;

// //     @ApiProperty({
// //         description: 'nombre de la categoria',
// //         example: 'Sahumerio'
// //     })
// //     @Column({
// //         type: 'varchar', 
// //         length: 50,
// //         unique:true
// //     })
// //     name: string;

// //     @ApiProperty({
// //         description: 'Descripción de la categoría',
// //         example: 'Sahumerios de distintas marcas',
// //         required: false,
// //       })
// //     @Column({ type: 'text', nullable: true })
// //     description: string;

// //     //1:N con products
// //     @OneToMany(() => Brand, brand => brand.categories)
// //     @JoinColumn({name: 'brand_id'})
// //     brands: Brand[];
// // }

// import { ApiProperty } from "@nestjs/swagger";
// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
// import { Brand } from "src/brands/entities/brand.entity";

// @Entity({ name: 'categories' })
// export class Category {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ApiProperty({
//     description: 'Nombre de la categoría',
//     example: 'Sahumerio'
//   })
//   @Column({
//     type: 'varchar',
//     length: 50,
//     unique: true
//   })
//   name: string;

//   @ApiProperty({
//     description: 'Descripción de la categoría',
//     example: 'Sahumerios de distintas marcas',
//     required: false,
//   })
//   @Column({ type: 'text', nullable: true })
//   description?: string;


//   @Column({type:'text', 
//     default: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg'})
//   imgURL: string;


//   // ✅ 1 categoría tiene muchas marcas
//   @OneToMany(() => Brand, (brand) => brand.category)
//   brands: Brand[];
// }

//refactor
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Brand } from "src/brands/entities/brand.entity";

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Sahumerios'
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Sahumerios de distintas marcas',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    default: 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg',
  })
  imgURL: string;

  // ✅ 1 categoría tiene muchas marcas
  @OneToMany(() => Brand, (brand) => brand.category)
  brands: Brand[];
}
