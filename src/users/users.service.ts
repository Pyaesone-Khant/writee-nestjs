import { Injectable, NotFoundException } from '@nestjs/common';
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
        const user = this.userRespository.create(createUserDto);
        return await this.userRespository.save(user);
    }

    async findAll() {
        return await this.userRespository.find();
    }

    async findOne(id: number) {
        const user = await this.userRespository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found!");
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);
        return await this.userRespository.update(id, updateUserDto);
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.userRespository.delete(id);
    }

    async findByEmail(email: string) {
        return await this.userRespository.findOne({ where: { email } });
    }
}
