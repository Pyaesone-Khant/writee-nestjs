import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>
  ) { }

  async create(createCommentDto: CreateCommentDto) {

    const user = await this.usersRepository.findOne({ where: { id: createCommentDto.user_id } });
    if (!user) throw new NotFoundException("User not found!");

    const blog = await this.blogsRepository.findOne({ where: { id: createCommentDto.blog_id } });
    if (!blog) throw new NotFoundException("Blog not found!");

    const comment = this.commentRepository.create({ ...createCommentDto, user, blog });
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    return await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.blog', 'blog')
      .select(['comment.id', 'comment.comment', 'user.id', 'user.name', 'user.email', 'user.image', 'blog.id'])
      .getMany();
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] })
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

  async findCommentsByBlogId(blogId: number) {
    const blog = await this.blogsRepository.findOne({ where: { id: blogId } });
    if (!blog) throw new NotFoundException("Blog not found!");
    return await this.commentRepository.createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .select(['comment.id', 'comment.comment', 'user.id', 'user.name', 'user.email', 'user.image',])
      .where("comment.blogId = :blogId", { blogId })
      .getMany()
  }

  async isUserAuthorized(userId: number, commentId: number) {
    const comment = await this.findOne(commentId)
    return comment.user?.id === userId;
  }
}
