import { ConflictException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindDataBySlugProvider } from 'src/common/providers/find-data-by-slug.provider';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        private readonly findDataBySlugProvider: FindDataBySlugProvider
    ) { }


    async findAll() {
        let categories: Category[] | [];

        try {
            categories = await this.categoryRepository.find();
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return categories;
    }

    async create(createCategoryDto: CreateCategoryDto) {
        let newCategory: Category | undefined;

        const category: Category | undefined = await this.findDataBySlugProvider.findDataBySlug<Category>(createCategoryDto.slug, this.categoryRepository);

        if (category) {
            throw new ConflictException("Category already exists!");
        }

        try {
            newCategory = this.categoryRepository.create(createCategoryDto);
            await this.categoryRepository.save(newCategory)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return newCategory;
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        })

        if (!category) {
            throw new NotFoundException("Category not found!")
        }

        return category
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category: Category | undefined = await this.findOne(id);

        const categoryBySlug: Category | undefined = await this.findDataBySlugProvider.findDataBySlug<Category>(updateCategoryDto.slug, this.categoryRepository);

        if (categoryBySlug && categoryBySlug.id !== id) {
            throw new ConflictException("Category already exists!");
        }

        category.name = updateCategoryDto.name ?? category.name;
        category.description = updateCategoryDto.description ?? category.description;
        category.slug = updateCategoryDto.slug;

        try {
            await this.categoryRepository.save(category)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return category;
    }

    async remove(id: number): Promise<object> {
        await this.findOne(id);

        try {
            await this.categoryRepository.delete(id)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return { message: "Category deleted successfully!" }
    }
}
