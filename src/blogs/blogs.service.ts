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
        return await this.blogRepository.find({ relations: ['categories', 'user'] });
    }

    async findOne(id: number) {
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['categories', 'user'] });
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
}
