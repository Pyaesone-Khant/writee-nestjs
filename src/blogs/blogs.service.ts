import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async create(createBlogDto: CreateBlogDto, user_id: number) {
        const isDuplicate = await this.findByTitle(createBlogDto.title)
        if (isDuplicate) throw new ConflictException("Blog already exists!")

        const user = await this.userRepository.findOne({ where: { id: user_id }, select: ["id", "name", "email", "image"] });
        if (!user) throw new UnauthorizedException();
        const categories = await this.categoryRepository.find({ where: { id: In(createBlogDto.category_ids) } })

        const blog = this.blogRepository.create({ ...createBlogDto, user, categories });
        return await this.blogRepository.save(blog)
    }

    async findAll() {

        return await this.blogRepository.createQueryBuilder("blog").leftJoinAndSelect("blog.categories", "categories").leftJoinAndSelect("blog.user", "user").select(["blog.id", "blog.title", "blog.description", "blog.image", "categories", "user.id", "user.name", "user.email", "user.image"]).getMany();
    }

    async findOne(id: number) {
        const blog = await this.blogRepository.createQueryBuilder('blog')
            .leftJoinAndSelect('blog.categories', 'categories')
            .leftJoinAndSelect('blog.user', 'user')
            .select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'categories', 'user.id', 'user.name', 'user.email', 'user.image'])
            .where('blog.id = :id', { id })
            .getOne();

        if (!blog) throw new NotFoundException("Blog not found!");
        return blog;
    }

    async update(id: number, updateBlogDto: UpdateBlogDto) {
        await this.findOne(id);
        return await this.blogRepository.update(id, updateBlogDto);
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.blogRepository.delete(id);
    }

    async findByTitle(title: string) {
        return await this.blogRepository.findOne({ where: { title } });
    }

    async findByUser(user_id: number) {
        const blogs = await this.blogRepository.createQueryBuilder('blog').leftJoinAndSelect('blog.categories', 'categories').leftJoinAndSelect('blog.user', 'user').where('user.id = :user_id', { user_id }).select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'categories']).getMany();
        return blogs;
    }

    async findByCategory(category_id: number) {
        const blogs = await this.blogRepository.createQueryBuilder('blog').leftJoinAndSelect('blog.categories', 'categories').leftJoinAndSelect('blog.user', 'user').where('categories.id = :category_id', { category_id }).select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'categories', 'user.id', 'user.name', 'user.email', 'user.image']).getMany();

        // get all categories related to each blog
        for (let blog of blogs) {
            const categories = await this.categoryRepository.createQueryBuilder('category')
                .innerJoin('category.blogs', 'blog')
                .where('blog.id = :blog_id', { blog_id: blog.id })
                .getMany();

            blog.categories = categories;
        }

        return blogs;
    }
}
