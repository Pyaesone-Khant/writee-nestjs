import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { CategoriesService } from './providers/categories.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        forwardRef(() => PostsModule)
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule { }
