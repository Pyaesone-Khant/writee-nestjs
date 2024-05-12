import { Module } from "@nestjs/common";
import AuthModule from "src/auth/auth.module";
import { BlogsModule } from "src/blogs/blogs.module";
import { CategoriesModule } from "src/categories/categories.module";
import { UsersModule } from "src/users/users.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [
    UsersModule,
    BlogsModule,
    CategoriesModule,
    AuthModule // auth module is imported to use the AuthService in BlogResponseInterceptor
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule { }
