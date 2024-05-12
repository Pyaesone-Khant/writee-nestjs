import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogResponseInterceptor } from 'src/blog-response.interceptor';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/auth/roles.guard';
import { fileFilter } from 'src/helpers/fileFilter';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Roles("ADMIN")
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('currentUser')
    async currentUser(@Req() request: any) {
        const { id: userId } = request?.user;
        return this.usersService.findOne(+userId);
    }

    @Public()
    @UseInterceptors(BlogResponseInterceptor)
    @Get(':id/blogs')
    findBlogs(@Param('id') id: string) {
        return this.usersService.findBlogs(+id);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);

    }

    @Patch('changeName')
    changeName(@Req() request: any, @Body() payload: { name: string }) {
        const { id: userId } = request?.user;
        return this.usersService.update(+userId, payload);
    }

    @Patch('changePassword')
    async changePassword(@Req() request: any, @Body() changePwsDto: ChangePasswordDto) {
        const { id: userId } = request?.user;
        await this.usersService.changePassword(userId, changePwsDto);
    }

    @Patch('changeEmail')
    async changeEmail(@Req() request: any, @Body() changeEmailDto: ChangeEmailDto) {
        const { id: userId } = request?.user;
        await this.usersService.changeEmail(userId, changeEmailDto);
    }

    @Patch("resetPassword")
    async resetPassword(@Body() changeEmailDto: ChangeEmailDto) {
        await this.usersService.resetPassword(changeEmailDto)
    }

    @Post("uploadImage")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    async uploadProfileImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
        const { id: userId } = request?.user;
        await this.usersService.uploadProfileImage(userId, file)
    }

    @Delete("removeImage")
    async removeProfileImage(@Req() request: any) {
        const { id: userId } = request?.user;
        await this.usersService.removeProfileImage(userId)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
