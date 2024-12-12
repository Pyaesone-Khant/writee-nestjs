import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false,
    })
    slug: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    content: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    description?: string;

    @Column({
        type: "boolean",
        nullable: false,
        default: true,
    })
    published: boolean;

    @Column({
        type: "varchar",
        nullable: true,
    })
    featuredImageUrl?: string;

    @ManyToOne(
        () => User,
        (user) => user.posts,
        {
            eager: true,
        }
    )
    author: User;

    @ManyToMany(
        () => Category,
        (category) => category.posts,
        {
            eager: true
        }
    )
    @JoinTable({
        name: "post_categories",
    })
    categories: Category[]

    @ManyToMany(
        () => User,
        (user) => user.likedPosts,
    )
    likedBy: User[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    isSaved: boolean = false;

    isLiked: boolean = false;
}