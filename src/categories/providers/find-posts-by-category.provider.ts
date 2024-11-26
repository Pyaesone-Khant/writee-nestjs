import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';

@Injectable()
export class FindPostsByCategoryProvider {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async findPostsByCategory(slug: string): Promise<Post[]> {
        let category: Category | undefined;

        try {
            category = await this.categoryRepository.findOne({
                where: {
                    slug
                },
                relations: ['posts', 'posts.author', 'posts.categories'],
                loadEagerRelations: true
            });
        } catch (error) {
            throw new RequestTimeoutException()
        }

        if (!category) {
            throw new NotFoundException('Category not found!');
        }

        return category.posts;
    }

}
