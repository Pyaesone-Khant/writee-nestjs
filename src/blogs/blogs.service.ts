import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { generateSlug } from 'src/helpers/generateSlug';
import { MessageResponse } from 'src/helpers/message-response.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { ILike, Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
        @Inject(forwardRef(() => CategoriesService)) private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly reactionService: ReactionService,
    ) { }

    async create(createBlogDto: CreateBlogDto, userId: number): Promise<Blog> {
        const { title, category_ids, description } = createBlogDto;
        if (!title || !description || !category_ids) throw new BadRequestException("Title, description and category ids are required!");
        await this.categoriesService.validateIds(category_ids);
        const categories = await this.categoriesService.findCategoryByIds(category_ids)
        delete createBlogDto.category_ids;
        const slug = generateSlug(title);
        const blog = this.blogRepository.create({ ...createBlogDto, user: { id: userId }, categories, slug });
        return await this.blogRepository.save(blog)
    }

    async findAll(token?: string) {
        const reqUser = await this.authService.decodeToken(token);
        const blogs = await this.blogRepository.find({ relations: ['categories', 'user'], order: { id: "DESC" } });
        const savedBlogsIds = reqUser ? reqUser?.savedBlogs?.map(b => b.blog.id) : [];
        const resBlogs = blogs?.map((blog) => {
            const isSaved = savedBlogsIds?.includes(blog.id);
            return { ...blog, isSaved }
        })
        return resBlogs;
    }

    async findOne(id: number, token?: string) {
        const reqUser = await this.authService.decodeToken(token);
        const savedBlogsIds = reqUser ? reqUser?.savedBlogs.map(b => b.blog.id) : []
        const isSaved = savedBlogsIds?.includes(id);
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['categories', 'user', 'reactions.user'] });
        if (!blog) throw new NotFoundException("Blog not found!");
        return {
            ...blog,
            reactions: blog.reactions.map((reaction) => reaction.user),
            isSaved
        };
    }

    async update(id: number, updateBlogDto: UpdateBlogDto): Promise<MessageResponse> {

        const { title, category_ids } = updateBlogDto;
        const blog = await this.findOne(id);
        const isDuplicate = await this.findByTitle(title)
        if (isDuplicate && isDuplicate?.id !== id) throw new BadRequestException("Blog title already exists!");

        await this.categoriesService.validateIds(category_ids)
        const categories = await this.categoriesService.findCategoryByIds(category_ids);
        delete updateBlogDto.category_ids;

        blog.categories = categories;
        if (blog.title !== title) blog.slug = generateSlug(title)
        await this.blogRepository.save(blog);
        await this.blogRepository.update(id, updateBlogDto);

        return { message: "Blog updated successfully!" };
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.blogRepository.delete(id);
    }

    async findByTitle(title: string): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { title }, relations: ['categories', 'user'] });
    }

    async findBySlug(slug: string, token?: string) {
        const reqUser = await this.authService.decodeToken(token);
        const savedBlogsIds = reqUser ? reqUser?.savedBlogs.map(b => b.blog.id) : []
        const blog = await this.blogRepository.findOne({ where: { slug }, relations: ['categories', 'user', 'reactions', 'reactions.user'] });
        const isSaved = savedBlogsIds?.includes(blog.id);
        if (!blog) throw new NotFoundException("Blog not found!");
        return {
            ...blog,
            isSaved
        };
    }

    async findComments(id: number): Promise<Comment[]> {
        await this.findOne(id);
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['comments', 'comments.user'] });
        return blog.comments;
    }

    async isAuthor(userId: number, id: number): Promise<boolean> {
        const blog = await this.findOne(id)
        return blog?.user?.id === userId;
    }

    async searchBlogs(query: string, token?: string): Promise<object[]> {
        const blogs = await this.blogRepository.find({
            where: [
                { title: ILike(`%${query}%`) },
            ], relations: ['user', 'categories']
        });

        const reqUser = await this.authService.decodeToken(token);
        const savedBlogsIds = reqUser ? reqUser?.savedBlogs.map(b => b.blog.id) : [];
        return blogs?.map(blog => {
            const isSaved = savedBlogsIds?.includes(blog.id);
            return { ...blog, isSaved }
        });
    }

    async reactBlog(blogId: number, userId: number): Promise<MessageResponse> {
        await this.findOne(blogId);
        const reaction = await this.reactionService.findOne({ blogId, userId });
        if (reaction) {
            await this.reactionService.remove({ blogId, userId });
            return { message: "Reaction removed!" }
        }

        await this.reactionService.create(userId, { blogId });
        return { message: "Reacted!" }
    }
}
