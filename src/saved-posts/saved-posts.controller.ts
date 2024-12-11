import { Controller, Get, Param, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { SavedPostsService } from './providers/saved-posts.service';

@Controller('saved-posts')
export class SavedPostsController {

    constructor(
        private readonly savedPostsService: SavedPostsService
    ) { }

    @Get()
    getSavedPosts(
        @ActiveUser() user: ActiveUserData
    ) {
        return this.savedPostsService.getSavedPosts(user);
    }

    @Post(':postId/save')
    savePost(
        @ActiveUser() user: ActiveUserData,
        @Param('postId') postId: number
    ) {
        return this.savedPostsService.savePost(user, postId);
    }

    @Post(':postId/unsave')
    unsavePost(
        @ActiveUser() user: ActiveUserData,
        @Param('postId') postId: number
    ) {
        return this.savedPostsService.unsavePost(user, postId);
    }

}
