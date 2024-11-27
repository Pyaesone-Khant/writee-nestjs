import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Post } from '../post.entity';
import { PostsService } from '../providers/posts.service';

@Injectable()
export class PostOwnershipGuard implements CanActivate {

  constructor(
    private readonly postsService: PostsService,

    private readonly reflector: Reflector, // 👈 Inject the Reflector => JIC when roles are related
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const user: ActiveUserData = request[REQUEST_USER_KEY];
    const postId = request.params.id;

    if (!user) {
      throw new ForbiddenException();
    }

    const post: Post = await this.postsService.findOne(postId);

    if (!post) {
      throw new NotFoundException();
    }

    if (post.author.id !== user.sub) {
      throw new ForbiddenException('You do not have permission to modify this post!');
    }

    return true;
  }
}
