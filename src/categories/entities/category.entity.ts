import { Blog } from "src/blogs/entities/blog.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @ManyToMany(() => Blog, blog => blog.id)
    blogs: Blog[];
}
