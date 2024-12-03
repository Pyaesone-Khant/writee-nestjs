import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { PostsService } from 'src/posts/providers/posts.service';
import { UsersService } from 'src/users/providers/users.service';
import { SearchResult } from '../interfaces/search-result.interface';

@Injectable()
export class SearchService {

    constructor(
        private readonly usersService: UsersService,

        private readonly postsService: PostsService,

        private readonly categoriesService: CategoriesService
    ) { }

    async search(q: string): Promise<SearchResult> {

        const users = await this.usersService.search(q);

        const posts = await this.postsService.search(q);

        const categories = await this.categoriesService.search(q);

        return { users, posts, categories };
    }

}
