import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostOwnershipGuard } from './guards/post-ownership.guard';
import { ParseAndValidateFormDataInterceptor } from './interceptors/parse-and-validate-form-data.interceptor';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get()
    @Auth(AuthType.None)
    findAll(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.postsService.findAll(paginationQueryDto);
    }

    @Get(':id')
    @Auth(AuthType.None)
    findOne(
        @Param('id') id: number
    ) {
        return this.postsService.findOne(id);
    }

    @Get('slug/:slug')
    @Auth(AuthType.None)
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
        @ActiveUser() user: ActiveUserData,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.postsService.create({ createPostDto, user, image });
    }

    @UseInterceptors(
        FileInterceptor('image'),
        new ParseAndValidateFormDataInterceptor(UpdatePostDto),
    )
    @Put(':id')
    @UseGuards(PostOwnershipGuard)
    update(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.postsService.update(id, updatePostDto, image)
    }

    @Delete(':id')
    @UseGuards(PostOwnershipGuard)
    remove(
        @Param('id') id: number,
    ) {
        return this.postsService.remove(id);
    }
}


