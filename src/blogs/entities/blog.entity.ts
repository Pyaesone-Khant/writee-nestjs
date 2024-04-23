import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "blogs" })
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @Column("longtext", { nullable: false })
    description: string;

    @Column({ default: null })
    image: string;

    @ManyToMany(() => Category, category => category.id)
    @JoinTable({
        name: "blog_category_id",
        joinColumn: {
            name: "blog_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories: Category[];

    @ManyToOne(() => User, user => user.blogs)
    user: User;

    @OneToMany(() => Comment, cmt => cmt.id)
    comments: Comment[]
} 
