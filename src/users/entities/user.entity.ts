import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  JoinTable, 
  BeforeInsert ,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';
import { Role } from './role.entity';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador único del usuario (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @Column()
  firstname: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @Column()
  lastname: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico único del usuario',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashed_password_123',
    description: 'Contraseña del usuario (solo si es autenticación interna)',
    nullable: true,
  })
  @Column({ nullable: true })
  password?: string;

  @ApiProperty({
    example: 'user_clerk_abc123',
    description: 'ID del usuario en el sistema externo (Clerk, Auth0, etc.)',
    nullable: true,
  })
  @Column({ nullable: true, unique: true })
  clerkId?: string;

  @ApiProperty({
    example: 'internal',
    description: 'Proveedor de autenticación: "internal" o "clerk"',
    enum: ['internal', 'clerk'],
    nullable: true,
  })
  @Column({ nullable: true })
  authProvider?: 'internal' | 'clerk';

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está activo en el sistema',
  })
  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({nullable: true})
  deletedAt?: Date;

  @ApiProperty({
    type: () => [Role],
    description: 'Lista de roles asociados al usuario',
  })
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  // ✅ Una marca tiene muchos productos base
    @OneToMany(() => Order, (order) => order.user)
    order: Order[];

  @BeforeInsert()
  validateAuthFields() {
    // Si no tiene password ni clerkId → error
    if (!this.password && !this.clerkId) {
      throw new BadRequestException('User must have either password or clerkId');
    }

    // Si tiene ambos → inconsistencia
    if (this.password && this.clerkId) {
      throw new BadRequestException('User cannot have both password and clerkId');
    }
  }
}
