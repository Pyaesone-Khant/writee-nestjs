import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class LikePostsProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async likePost(userId: number, post: Post): Promise<object> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['likedPosts']
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (this.checkIfUserLikedPost(post, user)) {
            throw new BadRequestException('Post already liked');
        }

        user.likedPosts.push(post);

        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: 'Post liked successfully',
        }
    }

    async unlikePost(userId: number, post: Post): Promise<object> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['likedPosts']
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (!this.checkIfUserLikedPost(post, user)) {
            throw new BadRequestException('Post not liked');
        }

        user.likedPosts = user.likedPosts.filter(likedPost => likedPost.id !== post.id);

        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: 'Post unliked successfully',
        }
    }

    checkIfUserLikedPost(post: Post, user?: User): boolean {
        return user ? user.likedPosts.some(likedPost => likedPost.id === post.id) : false;
    }

}
