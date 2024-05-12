import { ClassSerializerInterceptor, Controller, Get, Query, Req, UseInterceptors } from '@nestjs/common';
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
  async search(@Req() req: any, @Query('query') query: string) {
    const token = req.headers.authorization?.split(" ")[1];
    return await this.searchService.searchData(query, token);
  }
}
