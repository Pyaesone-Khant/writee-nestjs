import { Module } from '@nestjs/common';
import { BlogsModule } from 'src/blogs/blogs.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    UsersModule, BlogsModule, CategoriesModule
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule { }
