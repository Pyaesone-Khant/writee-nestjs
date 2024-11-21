import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly paginationProvider: PaginationProvider,
    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto): Promise<Paginated<Post>> {
        let posts: Paginated<Post> | [];

        try {
            posts = await this.paginationProvider.paginateQuery(paginationQueryDto, this.postRepository)
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return posts;
    }

    async findOne(id: number): Promise<Post> {

        let post: Post;

        try {
            post = await this.postRepository.findOne({
                where: { id }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    // async create(): Promise<Post> { }

    // async update(): Promise<Post> { }

    // async remove(): Promise<object> { }

}
