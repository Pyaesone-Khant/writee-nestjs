import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Post } from 'src/posts/post.entity';
import { FindPostsByUserProvider } from 'src/users/providers/find-posts-by-user.provider';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeUsernameDto } from '../dto/change-username.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';
import { ChangeEmailProvider } from './change-email.provider';
import { ChangePasswordProvider } from './change-password.provider';
import { ChangeUsernameProvider } from './change-username.provider';
import { CreateUserProvider } from './create-user.provider';
import { FindPopularAuthorsProvider } from './find-popular-authors.provider';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly createUserProvider: CreateUserProvider,

        private readonly paginationProvider: PaginationProvider,

        private readonly findPostsByUserProvider: FindPostsByUserProvider,

        private readonly changeUsernameProvider: ChangeUsernameProvider,

        private readonly changePasswordProvider: ChangePasswordProvider,

        private readonly changeEmailProvider: ChangeEmailProvider,

        private readonly findPopularAuthorsProvider: FindPopularAuthorsProvider

    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        let result: Paginated<User> | [];

        try {
            result = await this.paginationProvider.paginateQuery(paginationQueryDto, this.userRepository)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return result;
    }

    async create(createUserDto: CreateUserDto): Promise<object> {
        return await this.createUserProvider.create(createUserDto)
    }

    async findOne(id: number): Promise<User> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: { id },
                relations: ['savedPosts'],
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return user;
    }

    async findOneByUsername(username: string): Promise<User> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    username
                },
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findOne(id);
        try {
            await this.userRepository.update(id, updateUserDto)
        } catch (error) {
            throw new RequestTimeoutException();
        }
        return await this.findOne(id);
    }

    async changeUsername(userId: number, changeUsernameDto: ChangeUsernameDto): Promise<object> {
        return await this.changeUsernameProvider.changeUsername(userId, changeUsernameDto)
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<object> {
        return await this.changePasswordProvider.changePassword(userId, changePasswordDto)
    }

    async resetPassword(email: string, password: string): Promise<object> {
        return this.changePasswordProvider.resetPassword(email, password)
    }

    async changeEmail(userId: number, email: string): Promise<object> {
        return await this.changeEmailProvider.changeEmail(userId, email)
    }

    async remove(id: number) {
        return await this.userRepository.delete(id);
    }

    async findPosts(username: string): Promise<Post[]> {
        return await this.findPostsByUserProvider.findPostsByUser(username)
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    email
                }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }
        return user;
    }

    async search(q: string): Promise<User[]> {
        let users: User[] | [];

        try {
            users = await this.userRepository.createQueryBuilder('user')
                .where('user.username ILIKE :q', { q: `%${q}%` })
                .orWhere('user.name ILIKE :q', { q: `%${q}%` })
                .getMany()
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return users;
    }

    async findPopularAuthors(): Promise<User[]> {
        return await this.findPopularAuthorsProvider.findPopularAuthors();
    }

    async savePost(userId: number, post: Post): Promise<object> {
        const user: User | undefined = await this.findOne(userId);

        if (!user) {
            throw new NotFoundException("User not found!")
        }

        if (this.checkIfUserSavedPost(post, user)) {
            return { success: false, message: "Post already saved!" }
        }

        user.savedPosts.push(post)
        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return { success: true, message: "Post saved successfully!" }
    }

    async unsavePost(userId: number, post: Post): Promise<object> {
        const user: User | undefined = await this.findOne(userId);

        if (!user) {
            throw new NotFoundException("User not found!")
        }

        if (!this.checkIfUserSavedPost(post, user)) {
            return { success: false, message: "Post not saved!" }
        }

        user.savedPosts = user.savedPosts.filter(savedPost => savedPost.id !== post.id)
        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return { success: true, message: "Post unsaved successfully!" }
    }

    async findSavedPosts(userId: number): Promise<Post[]> {
        let posts: Post[] | [];

        try {
            posts = await this.userRepository.createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .leftJoinAndSelect('user.savedPosts', 'savedPosts')
                .getOne()
                .then(user => user?.savedPosts);
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return posts;
    }

    checkIfUserSavedPost(post: Post, user?: User): boolean {
        return user.savedPosts.some(savedPost => savedPost.id === post.id)
    }

    transformUserSavedPosts(posts: Post[], user?: User): Post[] {
        return posts.map(post => {
            if (user) {
                post.isSaved = this.checkIfUserSavedPost(post, user)
            } else {
                post.isSaved = false
            }
            return post
        })
    }
}
