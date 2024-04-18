import { Blog } from "src/blogs/entities/blog.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @ManyToMany(() => Blog, blog => blog.id)
    @JoinTable({
        name: "blog_category_id",
        joinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "blog_id",
            referencedColumnName: "id"
        }
    })
    blogs: Blog[];
}
