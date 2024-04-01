import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
    constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>) { }

    async create(createBlogDto: CreateBlogDto) {
        const blog = this.blogRepository.create(createBlogDto);
        return await this.blogRepository.save(blog)
    }

    async findAll() {
        return await this.blogRepository.find();
    }

    async findOne(id: number) {
        const blog = await this.blogRepository.findOne({ where: { id } });

        if (!blog) throw new NotFoundException("Blog not found!");
    }

    async update(id: number, updateBlogDto: UpdateBlogDto) {
        await this.findOne(id);
        return await this.blogRepository.update(id, updateBlogDto);
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.blogRepository.delete(id);
    }
}
