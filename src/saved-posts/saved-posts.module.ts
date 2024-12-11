import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { SavedPostsService } from './providers/saved-posts.service';
import { SavedPostsController } from './saved-posts.controller';
import { SavedPosts } from './saved-posts.entity';

@Module({
  controllers: [SavedPostsController],
  providers: [SavedPostsService],
  imports: [
    TypeOrmModule.forFeature([SavedPosts]),
    PostsModule
  ]
})
export class SavedPostsModule { }
