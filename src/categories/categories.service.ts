import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);

        return await this.categoryRepository.save(category);
    }

    findAll() {
        return this.categoryRepository.find()
    }

    findOne(id: number) {
        const category = this.categoryRepository.findOne({
            where: { id }
        })

        if (!category) throw new HttpException({ "error": "Category not found!" }, 404)

        return category
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {

        const category = this.findOne(id)

        if (!category) {
            return null
        }

        return this.categoryRepository.update(id, updateCategoryDto)
    }

    remove(id: number) {
        return this.categoryRepository.delete(id)
    }
}
