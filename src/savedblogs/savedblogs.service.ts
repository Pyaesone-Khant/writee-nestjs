import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsService } from 'src/blogs/blogs.service';
import { Blog } from 'src/blogs/entities/blog.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Savedblog } from './entities/savedblog.entity';

@Injectable()
export class SavedblogsService {

  constructor(
    @InjectRepository(Savedblog)
    private savedblogRepository: Repository<Savedblog>,
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService
  ) { }

  async create({ userId, blogId }: { userId: number, blogId: number }) {
    const user = await this.usersService.findOne(userId)
    const blog = await this.blogsService.findOne(blogId)

    const alreadySaved = await this.findOne({ userId, blogId })
    if (alreadySaved) throw new BadRequestException("Blog already saved!")

    const savedBlog = this.savedblogRepository.create({ blog, user })
    await this.savedblogRepository.save(savedBlog);
    return { message: "Blog saved successfully!" }
  }

  async findAll(userId: number): Promise<Blog[]> {
    const blogs = await this.savedblogRepository.find({ where: { user: { id: userId } }, relations: ['blog', 'blog.categories', 'blog.user'] });
    return blogs.map(b => ({
      ...b.blog,
      isSaved: true
    }))
  }

  async findOne({ userId, blogId }: { userId: number, blogId: number }) {
    return await this.savedblogRepository.findOne({ where: { user: { id: userId }, blog: { id: blogId } } });
  }

  async remove({ userId, blogId }: { userId: number, blogId: number }) {
    const savedBlog = await this.findOne({ userId, blogId })
    if (!savedBlog) throw new BadRequestException("Blog not saved!")

    await this.savedblogRepository.delete({ user: { id: userId }, blog: { id: blogId } })
    return { message: "Blog removed from saved list!" }
  }
}
