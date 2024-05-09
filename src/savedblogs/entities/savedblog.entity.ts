import { Blog } from "src/blogs/entities/blog.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'savedblogs' })
export class Savedblog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, blog => blog.id)
  blog: Blog

  @ManyToOne(() => User, user => user.id)
  user: User
}
