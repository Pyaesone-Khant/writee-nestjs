import { Post } from "src/posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        nullable: true,
    })
    profileImageUrl?: string;

    @Column({
        default: false,
        nullable: false
    })
    isVerified: boolean;

    @Column({
        nullable: true
    })
    otp: string;

    @Column({
        nullable: true
    })
    otpExpiration: string;

    @OneToMany(
        () => Post,
        (post) => post.author
    )
    posts: Post[];
}
