import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
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

    @UseInterceptors(
        FileInterceptor('image'),
        new ParseAndValidateFormDataInterceptor(CreatePostDto),
    )
    @Post()
    async create(
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() image?: Express.Multer.File
    ) {
        return { createPostDto, image }
    }
}


