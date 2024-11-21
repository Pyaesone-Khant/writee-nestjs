import { Post } from "src/posts/post.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        nullable: false,
        unique: true
    })
    slug: string;

    @Column({
        nullable: true
    })
    description?: string;

    @ManyToMany(
        () => Post,
        (post) => post.id
    )
    posts: Post[];
}
