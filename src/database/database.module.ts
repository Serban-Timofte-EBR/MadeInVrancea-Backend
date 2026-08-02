import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../modules/businesses/entities/business.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Category, Business])],
  providers: [SeederService],
})
export class DatabaseModule {}
