import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import AuthModule from "src/auth/auth.module";
import { AwsModule } from "src/aws/aws.module";
import { CategoriesModule } from "src/categories/categories.module";
import { CommentModule } from "src/comment/comment.module";
import { ReactionModule } from "src/reaction/reaction.module";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { Blog } from "./entities/blog.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Blog]),
        AwsModule,
        forwardRef(() => CategoriesModule),
        ReactionModule,
        CommentModule,
        AuthModule // auth module is imported to use the AuthService in BlogResponseInterceptor,
    ],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
