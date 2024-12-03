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
import { User } from '../user.entity';
import { ChangeEmailProvider } from './change-email.provider';
import { ChangePasswordProvider } from './change-password.provider';
import { ChangeUsernameProvider } from './change-username.provider';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

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

        private readonly findUserByEmailProvider: FindUserByEmailProvider
    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        let users: Paginated<User> | [];

        try {
            users = await this.paginationProvider.paginateQuery(paginationQueryDto, this.userRepository)
        } catch (error) {
            throw new RequestTimeoutException()
        }
        return users;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.createUserProvider.create(createUserDto)
    }

    async findOne(id: number): Promise<User> {

        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: { id }
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
                where: { username }
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        return user;
    }

    async changeUsername(userId: number, changeUsernameDto: ChangeUsernameDto): Promise<object> {
        return await this.changeUsernameProvider.changeUsername(userId, changeUsernameDto)
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<object> {
        return await this.changePasswordProvider.changePassword(userId, changePasswordDto)
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
        return await this.findUserByEmailProvider.findUserByEmail(email)
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
}
