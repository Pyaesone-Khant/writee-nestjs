import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CommentGuard } from 'src/guards/comment.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  create(@Req() request: any, @Body() createCommentDto: CreateCommentDto) {
    const userId = request.user?.id;
    return this.commentService.create(userId, createCommentDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @UseGuards(CommentGuard)
  @Patch(':id')
  update(@Req() request: any, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @UseGuards(CommentGuard)
  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
