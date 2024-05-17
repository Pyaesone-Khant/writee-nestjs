import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
  ) { }

  async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({ ...createCommentDto, user: { id: userId }, blog: { id: createCommentDto.blogId } });
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    const comments = await this.commentRepository.find({ relations: ['user', 'user.roles'] });

    return comments.map(comment => ({
      ...comment,
      replies: this.findReplies(comment.id, comments)
    }))
  }

  findReplies(parentId: number, comments: Comment[] = []) {
    const data = comments.filter(cmt => cmt.parentId === parentId)
    return data;
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user', 'user.roles'] })
    if (!comment) throw new NotFoundException("Comment not found!");
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id)
    return await this.commentRepository.update(id, updateCommentDto)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.commentRepository.delete(id)
  }

  async removeByBlogId(blogId: number) {
    return await this.commentRepository.delete({ blog: { id: blogId } });
  }

  async findByBlogId(blogId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({ where: { blog: { id: blogId } }, relations: ['user', 'user.roles'] });
    return comments.filter(comment => comment.parentId === null).map(comment => ({
      ...comment,
      replies: this.findReplies(comment.id, comments)
    }))
  }

  async isAuthor(userId: number, commentId: number): Promise<boolean> {
    const comment = await this.findOne(commentId)
    return comment.user?.id === userId;
  }
}
