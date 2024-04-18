import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) { }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.userRepo.find({
      where: [
        { name: ILike(`%${query}%`) },
      ], select: ['id', 'name', 'email', 'image']
    });
    return users;
  }

  async searchBlogs(query: string): Promise<Blog[]> {
    //const blogs = await this.blogRepo.find({
    //  where: [
    //    { title: ILike(`%${query}%`) },
    //  ], relations: ['user', 'categories'], select: ['id', 'title', 'description', 'image', 'user', 'categories']
    //});

    const blogs = await this.blogRepo.createQueryBuilder("blog").leftJoinAndSelect("blog.categories", "categories").leftJoinAndSelect("blog.user", "user").where({ "title": ILike(`%${query}%`) }).select(["blog.id", "blog.title", "blog.description", "blog.image", "categories", "user.id", "user.name", "user.email", "user.image"]).getMany();

    return blogs;
  }

  async searchCategories(query: string): Promise<Category[]> {
    const categories = await this.categoryRepo.find({
      where: [
        { title: ILike(`%${query}%`) },
      ],
    });
    return categories;
  }

}
