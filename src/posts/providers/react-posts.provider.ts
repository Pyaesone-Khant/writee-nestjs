import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class ReactPostsProvider {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    async react(postId: number, user: User): Promise<object> {
        let post: Post | undefined;

        try {
            post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['likes']
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (!post) {
            throw new NotFoundException('Post Not Found!');
        }

        const isReacted = this.checkIfUserReacted(post, user);

        if (isReacted) {
            post.likes = post.likes.filter(like => like.id !== user.id);
        } else {
            post.likes.push(user);
        }

        try {
            await this.postRepository.save(post);
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return {
            success: true,
            message: isReacted ? 'Post unliked!' : 'Post liked!',
        }
    }

    checkIfUserReacted(post: Post, user?: User): boolean {
        return user ? post.likes.some(like => like.id === user.id) : false;
    }

}
