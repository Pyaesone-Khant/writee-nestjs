import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { BlogsService } from 'src/blogs/blogs.service';
import { fileFilter } from 'src/helpers/fileFilter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly blogsService: BlogsService,
        private readonly awsService: AwsService
    ) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id/blogs')
    findBlogs(@Param('id') id: string) {
        return this.blogsService.findByUser(+id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);

    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    async uploadProfileImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
        const userId = request?.user?.id;
        if (!file) {
            throw new BadRequestException("Please upload a file");
        }
        const image = await this.awsService.uploadFile(file);;
        return this.usersService.uploadProfileImage(+userId, image);
    }
}
