import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { CategoriesService } from './providers/categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule { }
