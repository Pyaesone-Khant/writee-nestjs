import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UsersModule } from 'src/users/users.module';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { CreatePostProvider } from './providers/create-post.provider';
import { FindPostsByCategoryProvider } from './providers/find-posts-by-category.provider';
import { PostsService } from './providers/posts.service';
import { UpdatePostProvider } from './providers/update-post.provider';

@Module({
    controllers: [PostsController],
    providers: [PostsService, CreatePostProvider, UpdatePostProvider, FindPostsByCategoryProvider],
    imports: [
        TypeOrmModule.forFeature([Post]),
        PaginationModule,
        forwardRef(() => CategoriesModule),
        UsersModule
    ],
    exports: [PostsService]
})
export class PostsModule { }
