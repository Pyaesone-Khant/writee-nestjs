import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { CreateSavedblogDto } from './dto/create-savedblog.dto';
import { SavedblogsService } from './savedblogs.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('saved-blogs')
export class SavedblogsController {
  constructor(private readonly savedblogsService: SavedblogsService) { }

  @Post()
  create(@Req() req: any, @Body() body: CreateSavedblogDto) {
    const { id: userId } = req.user;
    const { blogId } = body;
    return this.savedblogsService.create({ userId, blogId });
  }

  @Get()
  findAll(@Req() req: any) {
    const { id: userId } = req.user;
    return this.savedblogsService.findAll(userId);
  }

  @Delete()
  remove(@Req() req: any, @Body() body: CreateSavedblogDto) {
    const { id: userId } = req.user;
    const { blogId } = body;
    return this.savedblogsService.remove({ userId, blogId });
  }
}
