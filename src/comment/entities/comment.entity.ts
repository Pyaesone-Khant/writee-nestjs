import { Blog } from "src/blogs/entities/blog.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { nullable: false })
    comment: string;

    @Column({ type: "int", default: null })
    parentId: number;

    @ManyToOne(() => Blog, blog => blog.comments)
    blog: Blog

    @ManyToOne(() => User, user => user.comments)
    user: User
}

