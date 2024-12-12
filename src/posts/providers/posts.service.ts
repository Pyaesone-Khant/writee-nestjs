import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
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

        private readonly createPostProvider: CreatePostProvider,

        private readonly updatePostProvider: UpdatePostProvider,

        private readonly findPostsByCategoryProvider: FindPostsByCategoryProvider,

        private readonly usersService: UsersService,
    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto, activeUser?: ActiveUserData): Promise<Paginated<Post>> {
        let posts: Post[] | [];
        let totalItems: number;

        const { page, limit } = paginationQueryDto;

        const user: User | undefined = activeUser && await this.usersService.findOne(activeUser.sub);

        try {
            posts = await this.postRepository.find({
                where: {
                    published: true
                },
                order: {
                    createdAt: 'DESC'
                },
                relations: ['categories', 'author'],
                take: limit,
                skip: limit * (page - 1)
            })
            totalItems = await this.postRepository.count({ where: { published: true } });
        } catch (error) {
            throw new RequestTimeoutException();
        }

        const data = posts.map(post => this.usersService.transformUserPost(post, user))

        const meta = {
            totalItems,
            itemsPerPage: limit,
            totalPages: Math.ceil(totalItems / limit)
        }

        return { data, meta }
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
            throw new NotFoundException("Post not found!");
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

    async findBySlug(slug: string, activeUser?: ActiveUserData): Promise<Post> {
        let post: Post | undefined;

        const user = activeUser && await this.usersService.findOne(activeUser.sub)

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

        return this.usersService.transformUserPost(post, user)
    }

    async findPostsByCategory(category: string, paginationQueryDto: PaginationQueryDto, activeUser?: ActiveUserData): Promise<Paginated<Post>> {
        return await this.findPostsByCategoryProvider.findPostsByCategory(category, paginationQueryDto, activeUser)
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

    // used as a toggle to publish and unpublish a post
    async publish(id: number): Promise<object> {
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

        post.published = !post.published

        try {
            await this.postRepository.save(post)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return { success: true, message: `Post ${post.published ? 'published' : 'unpublished'} successfully!` };
    }

    async savePost(id: number, user: ActiveUserData): Promise<object> {
        const post: Post = await this.findOne(id);
        return await this.usersService.savePost(user.sub, post)
    }

    async unsavePost(id: number, user: ActiveUserData): Promise<object> {
        const post: Post = await this.findOne(id);
        return await this.usersService.unsavePost(user.sub, post)
    }

    async likePost(id: number, user: ActiveUserData): Promise<object> {
        const post: Post = await this.findOne(id);
        return await this.usersService.likePost(user.sub, post)
    }

    async unlikePost(id: number, user: ActiveUserData): Promise<object> {
        const post: Post = await this.findOne(id);
        return await this.usersService.unlikePost(user.sub, post)
    }
}
