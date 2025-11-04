// // src/users/entities/user.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
// import { Role } from './role.entity';


// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   password: string;

//   @Column()
//   fullName: string;

//   @ManyToMany(() => Role, (role) => role.users, { eager: true })//eager: true hace que al cargar un usuario, se traigan automáticamente sus roles.
//   @JoinTable({
//     name: 'user_roles', // tabla intermedia
//     joinColumn: { name: 'user_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
//   })
//   roles: Role[];
// }
//entity con posibilidad de autenticacion externa(clerk, etc) e interna 
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
import { Role } from './role.entity';
import { BadRequestException } from '@nestjs/common';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  clerkId?: string;

  @Column({ nullable: true })
  authProvider?: 'internal' | 'clerk';

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

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
