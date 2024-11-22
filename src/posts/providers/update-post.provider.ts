import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { Repository } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../post.entity';

@Injectable()
export class UpdatePostProvider {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly categoriesService: CategoriesService,
    ) { }

    async updatePost(id: number, updatePostDto: UpdatePostDto, image?: Express.Multer.File): Promise<Post> {
        const post: Post | undefined = await this.postRepository.findOne({
            where: { id }
        });

        if (!post) {
            throw new NotFoundException('Post not found!');
        }

        const categories: Category[] | [] = await this.categoriesService.findMultipleCategories(updatePostDto.categoryIds);

        if (categories?.length !== updatePostDto.categoryIds?.length) {
            throw new BadRequestException('Invalid category id recieved!');
        }

        post.title = updatePostDto.title ?? post.title;
        post.slug = updatePostDto.slug ?? post.slug;
        post.content = updatePostDto.content ?? post.content;
        post.description = updatePostDto.description ?? post.description;
        post.categories = categories;

        try {
            await this.postRepository.save(post);
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return post;
    }
}
