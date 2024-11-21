import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255,
        nullable: false,
    })
    title: string;

    @Column({
        length: 255,
        nullable: false,
    })
    slug: string;

    @Column({
        nullable: false,
    })
    content: string;

    @Column({
        nullable: true,
    })
    description?: string;

    @Column({
        nullable: false,
        default: false,
    })
    published: boolean;

    @Column({
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
    categories: Category[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}