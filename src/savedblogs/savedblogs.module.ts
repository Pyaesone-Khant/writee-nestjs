import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Savedblog } from "./entities/savedblog.entity";
import { SavedblogsController } from "./savedblogs.controller";
import { SavedblogsService } from "./savedblogs.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Savedblog]),
  ],
  controllers: [SavedblogsController],
  providers: [SavedblogsService],
  exports: [SavedblogsService]
})
export class SavedblogsModule { }
