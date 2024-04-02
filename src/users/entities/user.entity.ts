import { IsEmail } from "class-validator";
import { Blog } from "src/blogs/entities/blog.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, })
    name: string;

    @IsEmail()
    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: null })
    image: string;

    @Column({ default: false, nullable: false })
    is_verified: boolean;

    @Column({ default: null })
    otp: string;

    @Column({ default: null })
    otp_expiration: string;

    @ManyToMany(() => Blog, blog => blog.id)
    blogs: Blog[];
}
