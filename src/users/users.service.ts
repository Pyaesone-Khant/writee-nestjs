import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async findAll() {
        return await this.userRepository.find({ select: ["id", "image", "name", "email", "is_verified"] });
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }, select: ["id", "image", "name", "email", "is_verified", "blogs"], relations: {
                blogs: true
            }
        });
        if (!user) throw new NotFoundException("User not found!");
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);
        return await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.userRepository.delete(id);
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
