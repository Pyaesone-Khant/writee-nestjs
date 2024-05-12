import { Blog } from "src/blogs/entities/blog.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "reactions" })
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.reactions)
  blog: Blog;
}
