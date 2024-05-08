import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class CommentGuard implements CanActivate {

  constructor(
    private readonly commentService: CommentService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id;
    const commentId = +request?.params.id;
    const isAuthorized = await this.commentService.isAuthor(userId, commentId);
    if (!isAuthorized) throw new UnauthorizedException("You are not authorized to perform this action!");
    return true;
  }

}