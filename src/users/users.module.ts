import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { InitialSeeder } from 'src/common/seeds/seed.superadmin';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, InitialSeeder],
  exports: [TypeOrmModule, UsersService], 
})
export class UsersModule {}
