import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsService } from 'src/blogs/blogs.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => BlogsService)) private readonly blogsService: BlogsService,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService
  ) { }

  async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({ ...createCommentDto, user: { id: userId }, blog: { id: createCommentDto.blogId } });
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    const comments = await this.commentRepository.find({ relations: ['user', 'blog'] });

    const data = comments.map(comment => {
      return {
        id: comment.id,
        comment: comment.comment,
        blogId: comment.blog.id,
        userId: comment.user.id
      }
    })

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
    return await this.commentRepository.find({ where: { blog: { id: blogId } }, relations: ['user', 'user.roles'] });
  }

  async isAuthor(userId: number, commentId: number): Promise<boolean> {
    const comment = await this.findOne(commentId)
    return comment.user?.id === userId;
  }
}
