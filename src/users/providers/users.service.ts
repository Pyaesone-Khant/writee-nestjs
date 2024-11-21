import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRespository: Repository<User>,

        private readonly findUserByEmailProvider: FindUserByEmailProvider,

        private readonly paginationProvider: PaginationProvider,
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

    async create(createUserDto: CreateUserDto) {
        let newUser: User | undefined;

        const user = await this.findUserByEmailProvider.findUserByEmail(createUserDto.email);

        if (user) {
            throw new ConflictException('User with email already exists!')
        }

        try {
            newUser = this.userRespository.create(createUserDto)
            await this.userRespository.save(newUser)
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return newUser;
    }

    async findOne(id: number) {
        return await this.userRespository.findBy({ id });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRespository.update(id, updateUserDto);
    }

    async remove(id: number) {
        return await this.userRespository.delete(id);
    }
}
