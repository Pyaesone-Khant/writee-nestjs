import { Exclude } from "class-transformer";
import { Blog } from "src/blogs/entities/blog.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { Reaction } from "src/reaction/entities/reaction.entity";
import { Role } from "src/roles/entities/role.entity";
import { Savedblog } from "src/savedblogs/entities/savedblog.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, })
    name: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    @Exclude()
    password: string;

    @Column({ default: null })
    image: string;

    @Column({ default: false, nullable: false })
    @Exclude()
    is_verified: boolean;

    @Column({ default: false, nullable: false })
    is_active: boolean;

    @Column({ default: null })
    @Exclude()
    otp: string;

    @Column({ default: null })
    @Exclude()
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

    @OneToMany(() => Comment, cmt => cmt.user)
    comments: Comment[]

    @OneToMany(() => Savedblog, savedBlog => savedBlog.user)
    savedBlogs: Savedblog[]

    @OneToMany(() => Reaction, reaction => reaction.user)
    reactions: Reaction[]
}
