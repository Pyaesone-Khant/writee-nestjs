import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class SavePostsProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findSavedPosts(userId: number): Promise<Post[]> {
        let posts: Post[] | [];

        try {
            posts = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['savedPosts']
            }).then((data) => data.savedPosts)
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return posts;
    }

    async savePost(userId: number, post: Post): Promise<object> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['savedPosts']
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (this.checkIfUserSavedPost(post, user)) {
            throw new BadRequestException('Post already saved!')
        }

        user.savedPosts.push(post);

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: 'Post saved successfully!'
        }
    }

    async unsavePost(userId: number, post: Post): Promise<object> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['savedPosts']
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (!this.checkIfUserSavedPost(post, user)) {
            throw new BadRequestException('Post not saved!')
        }

        user.savedPosts = user.savedPosts.filter(savedPost => savedPost.id !== post.id)
        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: 'Post unsaved successfully!'
        }
    }

    checkIfUserSavedPost(post: Post, user?: User): boolean {
        return user ? user.savedPosts.some(savedPost => savedPost.id === post.id) : false;
    }

}
