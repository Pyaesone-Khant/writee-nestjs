import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { Like, Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class FindPostsByCategoryProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly usersService: UsersService,
    ) { }

    async findPostsByCategory(category: string, paginationQueryDto: PaginationQueryDto, activeUser?: ActiveUserData): Promise<Paginated<Post>> {
        const { limit, page } = paginationQueryDto;
        let posts: Post[] | [];
        let postsCount: number = 0;

        const user: User | undefined = activeUser && await this.usersService.findOne(activeUser.sub);

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
            data: posts.map(post => this.usersService.transformUserPost(post, user)),
            meta: {
                totalItems: postsCount,
                itemsPerPage: limit,
                totalPages: Math.ceil(postsCount / limit),
            }
        }

        return response;

    }
}
