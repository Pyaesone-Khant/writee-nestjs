import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User, Category]), UsersModule, CategoriesModule],
    controllers: [BlogsController],
    providers: [BlogsService],
})
export class BlogsModule { }
