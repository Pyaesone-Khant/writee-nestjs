import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class BlogResponseInterceptor implements NestInterceptor {

  constructor(
    private readonly authService: AuthService
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1];

    const reqUser = await this.authService.decodeToken(token);

    const reqUserSavedBlogIds = reqUser ? reqUser?.savedBlogs.map(b => b.blog.id) : []

    return next.handle().pipe(
      map(data => {

        const typeOfData = typeof data;

        // for single blog
        if (typeOfData === 'object' && data.hasOwnProperty("id")) {
          return {
            ...data,
            isSaved: reqUserSavedBlogIds.includes(data.id)
          }
        }


        // for search route
        if (typeOfData === 'object' && data.hasOwnProperty("blogs")) {
          return {
            ...data,
            blogs: data.blogs.map(blog => {
              return {
                ...blog,
                isSaved: reqUserSavedBlogIds.includes(blog.id)
              }
            })
          }
        }

        // for all blogs
        const blogs = data.map(blog => {
          return {
            ...blog,
            isSaved: reqUserSavedBlogIds.includes(blog.id)
          }
        });

        return blogs;
      })
    )
  }
}