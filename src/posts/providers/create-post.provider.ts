import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Category } from 'src/categories/category.entity';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../post.entity';

@Injectable()
export class CreatePostProvider {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly categoriesService: CategoriesService,

        private readonly usersService: UsersService
    ) { }

    async createPost({ createPostDto, user, image }: { createPostDto: CreatePostDto, user: ActiveUserData, image?: Express.Multer.File }): Promise<Post> {
        const categories: Category[] | [] = await this.categoriesService.findMultipleCategories(createPostDto.categoryIds);

        if (categories?.length !== createPostDto.categoryIds?.length) {
            throw new BadRequestException("Invalid category id recieved!")
        };

        const author: User | undefined = await this.usersService.findOne(user.sub);

        if (!author) {
            throw new BadRequestException("Invalid author id recieved!")
        }

        let post: Post | undefined;

        try {
            post = this.postRepository.create({
                ...createPostDto,
                categories,
                author,
            })
            await this.postRepository.save(post)
        } catch (error) {
            throw new RequestTimeoutException(error);
        }

        return post;

    }
}
