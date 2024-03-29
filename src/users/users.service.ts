import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRespository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto) {
        return await this.userRespository.create(createUserDto);
    }

    async findAll() {
        return await this.userRespository.find();
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
