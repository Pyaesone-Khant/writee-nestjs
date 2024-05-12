import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import AuthModule from "src/auth/auth.module";
import { AwsModule } from "src/aws/aws.module";
import { CategoriesModule } from "src/categories/categories.module";
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
        AuthModule
    ],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
