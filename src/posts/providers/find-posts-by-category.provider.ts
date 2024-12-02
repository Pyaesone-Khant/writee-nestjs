import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { Like, Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class FindPostsByCategoryProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async findPostsByCategory(category: string, paginationQueryDto: PaginationQueryDto): Promise<Paginated<Post>> {
        const { limit, page } = paginationQueryDto;
        let posts: Post[] | [];
        let postsCount: number = 0;

        try {
            posts = await this.postRepository.find({
                where: {
                    categories: {
                        slug: Like(category)
                    }
                },
                relations: ['categories', 'author'],
                relationLoadStrategy: "query",
                take: limit,
                skip: limit * (page - 1),
            })
            postsCount = await this.postRepository.count({
                where: {
                    categories: {
                        slug: Like(category)
                    }
                }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        const response: Paginated<Post> = {
            data: posts,
            meta: {
                totalItems: postsCount,
                itemsPerPage: limit,
                totalPages: Math.ceil(postsCount / limit),
            }
        }

        return response;

    }
}
