import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CommentGuard } from 'src/guards/comment.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  create(@Req() request: any, @Body() createCommentDto: CreateCommentDto) {
    createCommentDto.userId = request.user?.id;
    return this.commentService.create(createCommentDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Public()
  @Get("blog/:blogId")
  findCommentsByBlogId(@Param("blogId") blogId: string) {
    return this.commentService.findCommentsByBlogId(+blogId)
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(CommentGuard)
  update(@Req() request: any, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(CommentGuard)
  remove(@Req() request: any, @Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
