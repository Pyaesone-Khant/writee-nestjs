import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { Category } from 'src/categories/entities/category.entity';
import { CommentModule } from 'src/comment/comment.module';
import { User } from 'src/users/entities/user.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User, Category]), AwsModule, CommentModule],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
