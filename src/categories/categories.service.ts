import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const isExist = await this.categoryRepository.findOne({ where: { title: createCategoryDto.title } });
        if (isExist) throw new ConflictException("Category already exist!");

        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async findAll() {
        return await this.categoryRepository.find({ order: { id: "DESC" } })
    }

    async findOne(id: number) {
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
}
