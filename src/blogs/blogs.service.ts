import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { generateSlug } from 'src/helpers/generateSlug';
import { MessageResponse } from 'src/helpers/message-response.dto';
import { UsersService } from 'src/users/users.service';
import { ILike, Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
        @Inject(forwardRef(() => CategoriesService)) private readonly categoriesService: CategoriesService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async create(createBlogDto: CreateBlogDto, userId: number): Promise<Blog> {
        const { title, category_ids, description } = createBlogDto;
        if (!title || !description || !category_ids) throw new BadRequestException("Title, description and category ids are required!");
        const user = await this.usersService.findOne(userId);
        await this.categoriesService.validateIds(category_ids);
        const categories = await this.categoriesService.findCategoryByIds(category_ids)
        delete createBlogDto.category_ids;
        const slug = generateSlug(title);
        const blog = this.blogRepository.create({ ...createBlogDto, user, categories, slug });
        return await this.blogRepository.save(blog)
    }

    async findAll(token: string) {

        const decoded = token && await this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
        const blogs = await this.blogRepository.find({ relations: ['categories', 'user'], order: { id: "DESC" } });
        const user = await this.usersService.findOne(decoded?.id);
        const savedBlogsIds = user.savedBlogs?.map((blog) => blog.blog.id)
        const resBlogs = blogs?.map((blog) => ({
            ...blog,
            isSaved: token ? savedBlogsIds.includes(blog.id) : false
        }))
        return resBlogs;
    }

    async findOne(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['categories', 'user'] });

        if (!blog) throw new NotFoundException("Blog not found!");
        return blog;
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

    async findBySlug(slug: string): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { slug }, relations: ['categories', 'user'] });

        if (!blog) throw new NotFoundException("Blog not found!");
        return blog;
    }

    async findComments(id: number): Promise<Comment[]> {
        await this.findOne(id);
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['comments', 'comments.user'] });
        return blog.comments;
    }

    async isAuthor(userId: number, id: number): Promise<boolean> {
        const blog = await this.findOne(id)
        return blog.user?.id === userId;
    }

    async searchBlogs(query: string): Promise<Blog[]> {
        return await this.blogRepository.find({
            where: [
                { title: ILike(`%${query}%`) },
            ], relations: ['user', 'categories']
        });
    }
}
