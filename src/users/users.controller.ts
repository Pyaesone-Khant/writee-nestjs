import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.usersService.findAll(paginationQueryDto);
    }

    @Get(':username/posts')
    findPosts(@Param('username') username: string) {
        return this.usersService.findPosts(username);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Get(':username/details')
    findOneByUsername(@Param('username') username: string) {
        return this.usersService.findOneByUsername(username);
    }

    @Patch('/change-username')
    changeUsername(@Param('id') id: number, @Body() changeUsernameDto: ChangeUsernameDto) {
        return this.usersService.changeUsername(+id, changeUsernameDto);
    }

    @Patch(':id/change-password')
    changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
        return this.usersService.changePassword(+id, changePasswordDto);
    }

    @Patch('/change-email')
    changeEmail(@Param('id') id: number, @Body() { email }: { email: string }) {
        return this.usersService.changeEmail(+id, email);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(+id);
    }
}
