import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/auth/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) { }

    @Roles("ADMIN")
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Public()
    @Get(":id/blogs")
    findBlogs(@Req() req: any, @Param('id') id: string) {
        const token = req.headers.authorization.split(" ")[1];
        return this.categoriesService.findBlogsByCategory(+id, token);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(+id);
    }

    @Roles("ADMIN")
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(+id, updateCategoryDto);
    }

    @Roles("ADMIN")
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(+id);
    }
}
