import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Repository } from 'typeorm';
import { Savedblog } from './entities/savedblog.entity';

@Injectable()
export class SavedblogsService {

  constructor(
    @InjectRepository(Savedblog)
    private savedblogRepository: Repository<Savedblog>,
  ) { }

  async create({ userId, blogId }: { userId: number, blogId: number }) {
    const alreadySaved = await this.findOne({ userId, blogId })
    if (alreadySaved) throw new BadRequestException("Blog already saved!")

    const savedBlog = this.savedblogRepository.create({ blog: { id: blogId }, user: { id: userId } })
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
