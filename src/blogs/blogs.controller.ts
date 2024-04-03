import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Public } from "src/decorators/public.decorator";
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post()
    create(@Req() request: any, @Body() createBlogDto: CreateBlogDto) {

        const user_id = request?.user?.id
        const { title, description, category_ids } = createBlogDto;
        console.log(user_id)

        if (!title || !description || !category_ids || !user_id) throw new BadRequestException("Please provide all the required fields!")
        const blogData = { ...createBlogDto, user_id }

        return this.blogsService.create(blogData);
    }

    @Public()
    @Get()
    findAll() {
        return this.blogsService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(+id, updateBlogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogsService.remove(+id);
    }
}
