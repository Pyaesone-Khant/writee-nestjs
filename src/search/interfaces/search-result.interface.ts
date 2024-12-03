import { Category } from "src/categories/category.entity";
import { Post } from "src/posts/post.entity";
import { User } from "src/users/user.entity";

export interface SearchResult {
    users: User[]
    posts: Post[]
    categories: Category[]
}