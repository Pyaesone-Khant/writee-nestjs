import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../post.entity';
import { CreatePostProvider } from './create-post.provider';
import { FindPostsByCategoryProvider } from './find-posts-by-category.provider';
import { UpdatePostProvider } from './update-post.provider';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly paginationProvider: PaginationProvider,

        private readonly createPostProvider: CreatePostProvider,

        private readonly updatePostProvider: UpdatePostProvider,

        private readonly findPostsByCategoryProvider: FindPostsByCategoryProvider,
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

    async create(
        {
            createPostDto,
            user,
            image
        }: {
            createPostDto: CreatePostDto,
            user: ActiveUserData,
            image?: Express.Multer.File,
        }
    ): Promise<Post> {
        return await this.createPostProvider.createPost({ createPostDto, user, image })
    }

    async update(id: number, updatePostDto: UpdatePostDto, image?: Express.Multer.File): Promise<Post> {
        return await this.updatePostProvider.updatePost(id, updatePostDto, image)
    }

    async remove(id: number): Promise<object> {
        await this.findOne(id);

        try {
            await this.postRepository.delete(id)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return { success: true, message: "Post deleted successfully!" }
    }

    async findBySlug(slug: string): Promise<Post> {
        let post: Post | undefined;

        try {
            post = await this.postRepository.findOne({
                where: { slug }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        if (!post) {
            throw new NotFoundException("Post not found!")
        }

        return post;
    }

    async findPostsByCategory(category: string, paginationQueryDto: PaginationQueryDto): Promise<Paginated<Post>> {
        return await this.findPostsByCategoryProvider.findPostsByCategory(category, paginationQueryDto)
    }

    async search(q: string): Promise<Post[]> {
        let posts: Post[] | [];

        try {
            posts = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.categories', 'categories')
                .leftJoinAndSelect('post.author', 'author')
                .where('post.title ILIKE :q', { q: `%${q}%` })
                .orWhere('post.content ILIKE :q', { q: `%${q}%` })
                .getMany()
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return posts;
    }

}
