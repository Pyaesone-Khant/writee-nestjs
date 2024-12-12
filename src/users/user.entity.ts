import { Exclude } from "class-transformer";
import { Post } from "src/posts/post.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    @Exclude()
    password: string;

    @Column({
        nullable: true,
    })
    profileImageUrl?: string;

    @Column({
        default: false,
        nullable: false
    })
    @Exclude()
    isVerified: boolean;

    @Column({
        nullable: true
    })
    @Exclude()
    otp: string;

    @Column({
        nullable: true
    })
    @Exclude()
    otpExpiration: string;

    @OneToMany(
        () => Post,
        (post) => post.author
    )
    posts: Post[];

    @ManyToMany(
        () => Post,
        (post) => post.id,
    )
    @JoinTable({ name: "saved_posts" })
    savedPosts: Post[]

    postCount?: number;
}
