import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
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
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    const userId = request.user?.id;
    if (!this.commentService.isUserAuthorized(+userId, +id)) throw new UnauthorizedException("You are not authorized to delete this comment!");
    return this.commentService.remove(+id);
  }
}
