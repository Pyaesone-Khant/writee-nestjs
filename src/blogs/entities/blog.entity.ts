import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { Reaction } from "src/reaction/entities/reaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "blogs" })
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false, unique: true })
    slug: string;

    @Column("longtext", { nullable: false })
    description: string;

    @Column({ default: null })
    image: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @ManyToMany(() => Category, category => category.blogs)
    @JoinTable({
        name: "blog_category_id",
        joinColumn: {
            name: "blog_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        },
    })
    categories: Category[];

    @ManyToOne(() => User, user => user.blogs)
    user: User;

    @OneToMany(() => Comment, cmt => cmt.blog)
    comments: Comment[]

    @OneToMany(() => Reaction, reaction => reaction.blog)
    reactions: Reaction[]
} 
