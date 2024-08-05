import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { BlogResponseInterceptor } from 'src/blog-response.interceptor';
import { Public } from "src/decorators/public.decorator";
import { BlogGuard } from 'src/guards/blog.guard';
import { fileFilter } from 'src/helpers/fileFilter';
import { BlogsService } from './blogs.service';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

@UseInterceptors(ClassSerializerInterceptor)
@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly awsService: AwsService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    async create(@Req() req: any, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        const userId = req?.user?.id;
        const createBlogDto = JSON.parse(body.data);
        if (file) {
            const image = await this.awsService.uploadFile(file);
            createBlogDto.image = image;
        }
        return await this.blogsService.create(createBlogDto, userId);
    }

    @Public()
    @UseInterceptors(BlogResponseInterceptor)
    @Get()
    findAll(@Query("page") page: number = 1, @Query("limit") limit: number = 3) {
        return this.blogsService.findAll({ page, limit });
    }

    @Public()
    @UseInterceptors(BlogResponseInterceptor)
    @Get("slug/:slug")
    findBySlug(@Param("slug") slug: string) {
        return this.blogsService.findBySlug(slug)
    }

    @Public()
    @UseInterceptors(BlogResponseInterceptor)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogsService.findOne(+id);
    }

    @UseGuards(BlogGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    async update(@Req() req: any, @Param('id') id: string, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        const updateBlogDto = JSON.parse(body.data);
        if (file) {
            const blog = await this.blogsService.findOne(+id);
            if (blog.image) {
                await this.awsService.deleteFile(blog.image);
            }
            const image = await this.awsService.uploadFile(file);
            updateBlogDto.image = image;
        }
        return this.blogsService.update(+id, updateBlogDto);
    }

    @UseGuards(BlogGuard)
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.blogsService.remove(+id);
    }

    @Public()
    @Get(":id/comments")
    async findCommentsByBlogId(@Param("id") id: string) {
        return await this.blogsService.findComments(+id)
    }

    @Post(":id/react")
    async react(@Req() req: any, @Param("id") id: string) {
        const userId = req?.user?.id;
        return await this.blogsService.reactBlog(+id, userId);
    }
}
