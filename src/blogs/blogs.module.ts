import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AwsModule } from "src/aws/aws.module";
import { CategoriesModule } from "src/categories/categories.module";
import { UsersModule } from "src/users/users.module";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { Blog } from "./entities/blog.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Blog]),
        AwsModule,
        forwardRef(() => CategoriesModule),
        forwardRef(() => UsersModule),
        JwtModule
    ],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
