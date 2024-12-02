import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { SlugChangerInterceptor } from 'src/common/interceptors/slug-changer.interceptor';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './providers/categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @Auth(AuthType.None)
    findAll() {
        return this.categoriesService.findAll();
    }

    @UseInterceptors(SlugChangerInterceptor)
    @Post()
    create(
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get(':id')
    @Auth(AuthType.None)
    findOne(
        @Param('id') id: number
    ) {
        return this.categoriesService.findOne(id);
    }

    @Get('slug/:slug')
    @Auth(AuthType.None)
    findOneBySlug(
        @Param('slug') slug: string
    ) {
        return this.categoriesService.findOneBySlug(slug);
    }

    @Get(':slug/posts')
    @Auth(AuthType.None)
    findPosts(
        @Param('slug') slug: string
    ) {
        return this.categoriesService.findPosts(slug);
    }

    @UseInterceptors(SlugChangerInterceptor)
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(
        @Param('id') id: number
    ) {
        return this.categoriesService.remove(id);
    }
}
