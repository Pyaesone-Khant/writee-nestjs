import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

    @Get(':id/posts')
    findPosts(@Param('id') id: number) {
        return this.usersService.findPosts(+id);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(+id);
    }
}
