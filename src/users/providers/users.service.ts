import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Post } from 'src/posts/post.entity';
import { FindPostsByUserProvider } from 'src/users/providers/find-posts-by-user.provider';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByUsernameProvider } from './find-user-by-username.provider';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRespository: Repository<User>,

        private readonly findUserByEmailProvider: FindUserByEmailProvider,

        private readonly findUserByUsernameProvider: FindUserByUsernameProvider,

        private readonly paginationProvider: PaginationProvider,

        private readonly findPostsByUserProvider: FindPostsByUserProvider,

    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        let users: Paginated<User> | [];

        try {
            users = await this.paginationProvider.paginateQuery(paginationQueryDto, this.userRespository)
        } catch (error) {
            throw new RequestTimeoutException()
        }
        return users;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        let newUser: User | undefined;

        const userByEmail = await this.findUserByEmailProvider.findUserByEmail(createUserDto.email);
        const userByUsername = await this.findUserByUsernameProvider.findUserByUsername(createUserDto.username);

        if (userByEmail) {
            throw new ConflictException('User with email already exists!')
        }

        if (userByUsername) {
            throw new ConflictException('Username already exists!')
        }

        try {
            newUser = this.userRespository.create(createUserDto)
            await this.userRespository.save(newUser)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return newUser;
    }

    async findOne(id: number): Promise<User> {

        let user: User | undefined;

        try {
            user = await this.userRespository.findOne({
                where: { id }
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {

        const user: User | undefined = await this.findOne(id);
        const userByEmail: User | undefined = await this.findUserByEmailProvider.findUserByEmail(updateUserDto.email);
        const userByUsername: User | undefined = await this.findUserByUsernameProvider.findUserByUsername(updateUserDto.username);

        if (userByEmail && userByEmail.id !== id) {
            throw new ConflictException('User with email already exists!')
        }

        if (userByUsername && userByUsername.id !== id) {
            throw new ConflictException('User with username already exists!')
        }

        user.name = updateUserDto.name ?? user.name;
        user.username = updateUserDto.username ?? user.username;
        user.email = updateUserDto.email ?? user.email;

        try {
            await this.userRespository.save(user)
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return user;
    }

    async remove(id: number) {
        return await this.userRespository.delete(id);
    }

    async findPosts(username: string): Promise<Post[]> {
        return await this.findPostsByUserProvider.findPostsByUser(username)
    }
}
