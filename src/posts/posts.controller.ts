import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseAndValidateFormDataInterceptor } from './interceptors/parse-and-validate-form-data.interceptor';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get()
    findAll(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.postsService.findAll(paginationQueryDto);
    }

    @Get(':id')
    findOne(
        @Param('id') id: number
    ) {
        return this.postsService.findOne(id);
    }

    @Get('slug/:slug')
    findBySlug(
        @Param('slug') slug: string
    ) {
        return this.postsService.findBySlug(slug);
    }

    @UseInterceptors(
        FileInterceptor('image'),
        new ParseAndValidateFormDataInterceptor(CreatePostDto),
    )
    @Post()
    create(
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() image?: Express.Multer.File
    ) {
        return this.postsService.create(createPostDto, image)
    }

    @UseInterceptors(
        FileInterceptor('image'),
        new ParseAndValidateFormDataInterceptor(UpdatePostDto),
    )
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @UploadedFile() image?: Express.Multer.File
    ) {
        return this.postsService.update(id, updatePostDto, image)
    }

    @Delete(':id')
    remove(
        @Param('id') id: number
    ) {
        return this.postsService.remove(id);
    }
}


