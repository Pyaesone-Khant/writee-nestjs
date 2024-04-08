import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { Public } from "src/decorators/public.decorator";
import { BlogGuard } from 'src/guards/blog.guard';
import { fileFilter } from 'src/helpers/fileFilter';
import { BlogsService } from './blogs.service';
import { UpdateBlogDto } from './dto/update-blog.dto';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

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
    async create(@Req() request: any, @Body() createBlogDto: any, @UploadedFile() file?: Express.Multer.File) {
        const user_id = request?.user?.id;
        const { title, description, category_ids } = createBlogDto;
        const categories = category_ids?.replace(/[\[\]]/g, "").split(",").map(Number); // Convert string to array of numbers
        createBlogDto.category_ids = categories;
        if (!title || !description || !category_ids) throw new BadRequestException("Please provide all the required fields!");
        if (file) {
            const result = await this.awsService.uploadFile(file);
            createBlogDto.image = result?.Location;
        }
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

    @Post("upload")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    uploadFile(
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File) {
        const { title, description, category_ids } = body;
        if (!title || !description || !category_ids) throw new BadRequestException("Please provide all the required fields!");
        const result = this.awsService.uploadFile(file);
        return result;
    }
}
