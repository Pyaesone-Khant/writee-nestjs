import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
import { SearchService } from './providers/search.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    UsersModule,
    PostsModule,
    CategoriesModule
  ]
})
export class SearchModule { }
