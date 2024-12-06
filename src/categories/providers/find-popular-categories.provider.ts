import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';

@Injectable()
export class FindPopularCategoriesProvider {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async findPopularCategories(): Promise<Category[]> {

        let categories: Category[] | [];

        try {
            categories = await this.categoryRepository
                .createQueryBuilder('category')
                .loadRelationCountAndMap('category.postCount', 'category.posts')
                .getMany()
                .then((it) => {
                    return it.filter((category) => category.postCount > 0)
                        .slice(0, 5)
                        .sort((a, b) => b.postCount - a.postCount);
                })
            return categories;
        } catch (error) {
            throw new RequestTimeoutException('Request Timeout');
        }

        return categories;
    }

}
