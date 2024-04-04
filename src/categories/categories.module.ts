import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from 'src/blogs/blogs.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), BlogsModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule { }
