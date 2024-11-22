import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UsersModule } from 'src/users/users.module';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { CreatePostProvider } from './providers/create-post.provider';
import { FindPostsByUserProvider } from './providers/find-posts-by-user.provider';
import { PostsService } from './providers/posts.service';
import { UpdatePostProvider } from './providers/update-post.provider';
import { FindPostsByCategoriesProvider } from './providers/find-posts-by-categories.provider';

@Module({
    controllers: [PostsController],
    providers: [PostsService, CreatePostProvider, UpdatePostProvider, FindPostsByUserProvider, FindPostsByCategoriesProvider],
    imports: [
        TypeOrmModule.forFeature([Post]),
        PaginationModule,
        CategoriesModule,
        forwardRef(() => UsersModule)
    ],
    exports: [
        FindPostsByUserProvider
    ]
})
export class PostsModule { }
