import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { SearchService } from './search.service';

@Public()
@Controller('search')
export class SearchController {

  constructor(
    private readonly searchService: SearchService
  ) { }

  @Get()
  async search(@Query('query') query: string) {
    const users = await this.searchService.searchUsers(query);
    const blogs = await this.searchService.searchBlogs(query);
    const categories = await this.searchService.searchCategories(query);

    return {
      users,
      blogs,
      categories,
    };
  }
}
