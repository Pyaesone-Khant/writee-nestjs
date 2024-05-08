import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from 'src/blogs/blogs.module';
import { UsersModule } from 'src/users/users.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment]),
        forwardRef(() => BlogsModule),
        forwardRef(() => UsersModule)
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule { }
