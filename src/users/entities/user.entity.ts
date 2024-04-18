import { IsEmail, IsStrongPassword } from "class-validator";
import { Blog } from "src/blogs/entities/blog.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, })
    name: string;

    @IsEmail()
    @Column({ nullable: false, unique: true })
    email: string;

    @IsStrongPassword()
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

    @ManyToMany(() => Role, role => role.id)
    @JoinTable({
        name: "user_role_id",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[]

    @OneToMany(() => Blog, blog => blog.user)
    blogs: Blog[];
}
