import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SupplierProduct } from "./supplier-product.entity";

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contactName?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  // ✅ Un proveedor puede tener muchos registros de productos que ha suministrado
  @OneToMany(() => SupplierProduct, (sp) => sp.supplier)
  suppliedProducts: SupplierProduct[];
}
