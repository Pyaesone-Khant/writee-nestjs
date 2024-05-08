import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { BlogsService } from "src/blogs/blogs.service";

@Injectable()
export class BlogGuard implements CanActivate {
  constructor(
    private readonly blogsService: BlogsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id;
    const blogId = +request.params.id;
    const isAuthorized = await this.blogsService.isAuthor(userId, blogId);
    if (!isAuthorized) throw new UnauthorizedException("You are not authorized to perform this action!");
    return true;
  }
}