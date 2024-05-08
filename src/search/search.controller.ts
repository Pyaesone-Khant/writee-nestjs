import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { SearchService } from './search.service';

@UseInterceptors(ClassSerializerInterceptor)
@Public()
@Controller('search')
export class SearchController {

  constructor(
    private readonly searchService: SearchService
  ) { }

  @Get()
  async search(@Query('query') query: string) {
    return await this.searchService.searchData(query);
  }
}
