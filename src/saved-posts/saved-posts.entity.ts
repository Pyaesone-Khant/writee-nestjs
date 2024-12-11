import { Post } from "src/posts/post.entity";
import { User } from "src/users/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SavedPosts {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
        () => User,
        user => user.id
    )
    user: User

    @ManyToOne(
        () => Post,
        post => post.id
    )
    post: Post
}