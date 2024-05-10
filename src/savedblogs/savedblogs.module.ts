import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersModule } from "src/users/users.module";
import { Savedblog } from "./entities/savedblog.entity";
import { SavedblogsController } from "./savedblogs.controller";
import { SavedblogsService } from "./savedblogs.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Savedblog]),
    BlogsModule,
    UsersModule
  ],
  controllers: [SavedblogsController],
  providers: [SavedblogsService],
  exports: [SavedblogsService]
})
export class SavedblogsModule { }
