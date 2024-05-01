import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { generateSlug } from 'src/helpers/generateSlug';
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

        const user = await this.userRepository.findOne({ where: { id: user_id }, select: ["id", "image", "name", "email"] });
        if (!user) throw new UnauthorizedException();

        const areIdsValid = await this.areIdsValid(createBlogDto.category_ids)
        if (!areIdsValid) throw new BadRequestException("Some category ids do not exist!")
        const categories = await this.categoryRepository.find({ where: { id: In(createBlogDto.category_ids) } })

        const slug = generateSlug(createBlogDto.title);

        const blog = this.blogRepository.create({ ...createBlogDto, user, categories, slug });
        return await this.blogRepository.save(blog)
    }

    async findAll() {
        return await this.blogRepository.createQueryBuilder("blog").leftJoinAndSelect("blog.categories", "categories").leftJoinAndSelect("blog.user", "user").select(["blog.id", "blog.title", "blog.description", "blog.image", "blog.slug", "categories", "user.id", "user.name", "user.email", "user.image"]).orderBy("blog.id", "DESC").getMany();
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

        const { title, category_ids, } = updateBlogDto;
        const blog = await this.findOne(id);
        const isDuplicate = await this.findByTitle(title)
        if (isDuplicate?.id !== id) throw new BadRequestException("Blog title already exists!");

        const areIdsValid = await this.areIdsValid(category_ids)
        if (!areIdsValid) throw new BadRequestException("Some category ids do not exist!")
        const categories = await this.categoryRepository.find({ where: { id: In(category_ids) } })
        delete updateBlogDto.category_ids;

        blog.categories = categories;
        blog.slug = generateSlug(title);
        await this.blogRepository.save(blog);
        await this.blogRepository.update(id, updateBlogDto);

        return { message: "Blog updated successfully!" };
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.blogRepository.delete(id);
    }

    async findByTitle(title: string) {
        return await this.blogRepository.findOne({ where: { title } });
    }

    async findBySlug(slug: string): Promise<Blog> {
        const blog = await this.blogRepository.createQueryBuilder('blog')
            .leftJoinAndSelect('blog.categories', 'categories')
            .leftJoinAndSelect('blog.user', 'user')
            .select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'categories', 'user.id', 'user.name', 'user.email', 'user.image'])
            .where('blog.slug = :slug', { slug })
            .getOne();

        if (!blog) throw new NotFoundException("Blog not found!");
        return blog;
    }

    async findByUser(user_id: number) {

        const user = await this.userRepository.findOne({ where: { id: user_id } });
        if (!user) throw new NotFoundException("User not found!")
        const blogs = await this.blogRepository.createQueryBuilder('blog').leftJoinAndSelect('blog.categories', 'categories').leftJoinAndSelect('blog.user', 'user').where('user.id = :user_id', { user_id }).select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'blog.slug', 'categories', "user.name", "user.id", "user.email", "user.image"]).orderBy("blog.id", "DESC").getMany();
        return blogs;
    }

    async findByCategory(category_id: number) {

        const category = await this.categoryRepository.findOne({ where: { id: category_id } })
        if (!category) throw new NotFoundException("Category not found!")

        const blogs = await this.blogRepository.createQueryBuilder('blog').leftJoinAndSelect('blog.categories', 'categories').leftJoinAndSelect('blog.user', 'user').where('categories.id = :category_id', { category_id }).select(['blog.id', 'blog.title', 'blog.description', 'blog.image', 'blog.slug', 'categories', 'user.id', 'user.name', 'user.email', 'user.image']).orderBy("blog.id", "DESC").getMany();

        // get all categories related to each blog
        for (const blog of blogs) {
            const categories = await this.categoryRepository.createQueryBuilder('category')
                .innerJoin('category.blogs', 'blog')
                .where('blog.id = :blog_id', { blog_id: blog.id })
                .getMany();

            blog.categories = categories;
        }
        return blogs;
    }

    async areIdsValid(ids: number[]) {
        const categories = await this.categoryRepository.createQueryBuilder("category").whereInIds(ids).getMany()
        return ids.length === categories.length;
    }

    async isUserAuthorized(userId: number, blogId: number) {
        const blog = await this.findOne(blogId)
        return blog.user?.id === userId;
    }
}
