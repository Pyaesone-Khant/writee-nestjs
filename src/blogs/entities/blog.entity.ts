import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "blogs" })
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column()
    image: string;

    @ManyToMany(() => Category, category => category.id)
    categories: Category[];

    @ManyToOne(() => User, user => user.id)
    user: User
} 
