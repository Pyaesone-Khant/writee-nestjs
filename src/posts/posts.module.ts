import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    imports: [
        TypeOrmModule.forFeature([Post]),
        PaginationModule
    ]
})
export class PostsModule { }
