import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User, Category])],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
