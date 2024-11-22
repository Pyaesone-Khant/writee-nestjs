import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class FindPostsByUserProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    async findPostsByUser(userId: number): Promise<Post[]> {
        let posts: Post[] | [];

        try {
            posts = await this.postRepository.find({
                where: {
                    author: {
                        id: userId
                    }
                }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return posts;

    }
}
