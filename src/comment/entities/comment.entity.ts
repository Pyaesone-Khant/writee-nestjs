import { Blog } from "src/blogs/entities/blog.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: false })
    comment: string;

    @ManyToOne(() => Blog, blog => blog.id)
    blog: Blog;

    @ManyToOne(() => User, user => user.id)
    user: User;
}
