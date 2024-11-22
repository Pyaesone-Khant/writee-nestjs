import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class FindPostsByCategoriesProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    async findPostsByCategories(categories: number[]) {
        let posts: Post[] | [];

        try {
            posts = await this.postRepository.find({
                where: {
                    categories: {
                        id: In(categories)
                    }
                }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return posts;
    }
}
