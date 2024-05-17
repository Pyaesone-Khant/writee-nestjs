import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CommentService } from 'src/comment/comment.service';
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
        private readonly reactionService: ReactionService,
        private readonly commentService: CommentService
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

    async findAll(): Promise<Blog[]> {
        return await this.blogRepository.find({ relations: ['categories', 'user'], order: { id: "DESC" } })
    }

    async findOne(id: number): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { id }, relations: ['categories', 'user', 'reactions', 'reactions.user'] });
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
        const blog = await this.findOne(id);

        blog.categories = [];
        blog.comments = [];
        blog.reactions = [];

        await this.commentService.removeByBlogId(id);
        await this.reactionService.removeByBlogId(id);

        await this.blogRepository.save(blog);
        return await this.blogRepository.delete(id);
    }

    async findByTitle(title: string): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { title }, relations: ['categories', 'user'] });
    }

    async findBySlug(slug: string): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { slug }, relations: ['categories', 'user', 'reactions', 'reactions.user'] });
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

    async searchBlogs(query: string): Promise<Blog[]> {
        return await this.blogRepository.find({
            where: [
                { title: ILike(`%${query}%`) },
            ], relations: ['user', 'categories']
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
