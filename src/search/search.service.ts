import { Injectable } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService
  ) { }

  async searchData(query: string, token?: string) {
    const users = await this.usersService.searchUsers(query)
    const blogs = await this.blogsService.searchBlogs(query, token)
    const categories = await this.categoriesService.searchCategories(query);

    return {
      users,
      blogs,
      categories
    }
  }

}
