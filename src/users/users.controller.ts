import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Auth(AuthType.None)
    findAll(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.usersService.findAll(paginationQueryDto);
    }

    @Get(':username/posts')
    @Auth(AuthType.None)
    findPosts(@Param('username') username: string) {
        return this.usersService.findPosts(username);
    }

    @Get('/popular-authors')
    @Auth(AuthType.None)
    findPopularAuthors() {
        return this.usersService.findPopularAuthors();
    }

    @Get('/me')
    @Auth(AuthType.Bearer)
    findMe(
        @ActiveUser() user: ActiveUserData
    ) {
        return this.usersService.findOne(user.sub);
    }

    @Get('/me/saved-posts')
    @Auth(AuthType.Bearer)
    findSavedPosts(
        @ActiveUser() user: ActiveUserData
    ) {
        return this.usersService.findSavedPosts(user.sub)
    }

    @Get(':id')
    @Auth(AuthType.None)
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Get(':username/details')
    @Auth(AuthType.None)
    findOneByUsername(@Param('username') username: string) {
        return this.usersService.findOneByUsername(username);
    }

    @Patch('/change-username')
    changeUsername(
        @ActiveUser() user: ActiveUserData,
        @Body() changeUsernameDto: ChangeUsernameDto
    ) {

        return this.usersService.changeUsername(user.sub, changeUsernameDto);
    }

    @Patch('/change-password')
    changePassword(
        @ActiveUser() user: ActiveUserData,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        return this.usersService.changePassword(user.sub, changePasswordDto);
    }

    @Patch('/change-email')
    changeEmail(
        @ActiveUser() user: ActiveUserData,
        @Body() { email }: { email: string }
    ) {
        return this.usersService.changeEmail(user.sub, email);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(+id);
    }
}
