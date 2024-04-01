import { IsEmail } from "class-validator";
import { Blog } from "src/blogs/entities/blog.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    image: string;

    @Column({ default: false, nullable: false })
    is_verified: boolean;

    @Column()
    otp: string;

    @Column()
    otp_expiration: string;

    @OneToMany(() => Blog, blog => blog.id)
    blogs: Blog[];
}
