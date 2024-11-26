import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { CategoriesService } from './providers/categories.service';
import { FindPostsByCategoryProvider } from './providers/find-posts-by-category.provider';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService, FindPostsByCategoryProvider],
    exports: [CategoriesService]
})
export class CategoriesModule { }
