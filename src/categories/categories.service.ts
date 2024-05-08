import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const isExist = await this.categoryRepository.findOne({ where: { title: createCategoryDto.title } });
        if (isExist) throw new ConflictException("Category already exist!");

        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({ order: { id: "DESC" } })
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        })
        if (!category) throw new NotFoundException("Category not found!");
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id);
        return await this.categoryRepository.update(id, updateCategoryDto)
    }

    async remove(id: number) {
        await this.findOne(id)
        return await this.categoryRepository.delete(id)
    }

    async findCategoryByIds(ids: number[]): Promise<Category[]> {
        return await this.categoryRepository.find({ where: { id: In(ids) } })
    }

    async validateIds(ids: number[]): Promise<boolean> {
        const categories = await this.categoryRepository.find({ where: { id: In(ids) } });
        if (categories.length !== ids.length) throw new NotFoundException("One or more categories not found!");
        return true;
    }

    async findBlogsByCategory(id: number): Promise<Blog[]> {
        const category = await this.categoryRepository.findOne({ where: { id }, relations: ["blogs", "blogs.categories", "blogs.user"] })
        return category.blogs;
    }

    async searchCategories(query: string): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: [
                { title: ILike(`%${query}%`) }
            ]
        })

    }
}
