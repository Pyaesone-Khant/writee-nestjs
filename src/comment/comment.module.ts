import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Blog])],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule { }
