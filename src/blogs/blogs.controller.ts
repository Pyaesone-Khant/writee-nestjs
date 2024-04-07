import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from "src/decorators/public.decorator";
import { BlogGuard } from 'src/guards/blog.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
    ) { }

    @Post()
    async create(@Req() request: any, @Body() createBlogDto: CreateBlogDto) {
        const user_id = request?.user?.id;
        const { title, description, category_ids } = createBlogDto;
        if (!title || !description || !category_ids) throw new BadRequestException("Please provide all the required fields!");
        return await this.blogsService.create(createBlogDto, user_id);
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

    @UseGuards(BlogGuard)
    @Patch(':id')
    update(@Req() request: any, @Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(+id, updateBlogDto);
    }

    @UseGuards(BlogGuard)
    @Delete(':id')
    remove(@Req() request: any, @Param('id') id: string) {
        return this.blogsService.remove(+id);
    }
}
