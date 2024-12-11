import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/providers/posts.service';
import { Repository } from 'typeorm';
import { SavedPosts } from '../saved-posts.entity';

@Injectable()
export class SavedPostsService {

    constructor(
        @InjectRepository(SavedPosts)
        private readonly savedPostsRepository: Repository<SavedPosts>,

        private readonly postsService: PostsService
    ) { }

    async getSavedPosts(user: ActiveUserData): Promise<Post[]> {
        let posts: Post[] | [];

        try {
            const savedPosts: SavedPosts[] = await this.savedPostsRepository.find({
                where: {
                    user: { id: user.sub }
                },
                relations: ['post']
            });

            posts = savedPosts.map(savedPost => savedPost.post);
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return posts?.map(post => ({ ...post, isSaved: true }));
    }


    async savePost(user: ActiveUserData, postId: number): Promise<object> {

        const post: Post = await this.postsService.findOne(postId);

        const isSaved: boolean = await this.checkSavedPost(user, postId);
        if (isSaved) {
            throw new BadRequestException("Post already saved")
        }

        try {
            await this.savedPostsRepository.save({
                user: { id: user.sub },
                post: post
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: "Post saved successfully"
        }
    }

    async unsavePost(user: ActiveUserData, postId: number): Promise<object> {

        const post: Post = await this.postsService.findOne(postId);

        const isSaved: boolean = await this.checkSavedPost(user, postId);
        if (!isSaved) {
            throw new BadRequestException(`You haven't saved this post yet!`)
        }

        try {
            await this.savedPostsRepository.delete({
                user: { id: user.sub },
                post: post
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: "Post unsaved successfully"
        }
    }

    private async checkSavedPost(user: ActiveUserData, postId: number): Promise<boolean> {
        const savedPost: SavedPosts = await this.savedPostsRepository.findOne({
            where: {
                user: { id: user.sub },
                post: { id: postId }
            }
        });

        return !!savedPost;
    }
}
