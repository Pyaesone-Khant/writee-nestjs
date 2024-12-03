import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { SearchService } from './providers/search.service';

@Controller('search')
export class SearchController {

    constructor(
        private readonly searchService: SearchService
    ) { }

    @Get()
    @Auth(AuthType.None)
    async search(
        @Query('q') q: string
    ) {
        return this.searchService.search(q)
    }
}
