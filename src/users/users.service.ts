import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly rolesService: RolesService
    ) { }

    async create(createUserDto: CreateUserDto) {
        const defaultRole = await this.rolesService.findByRoleName("USER");
        if (!defaultRole) throw new NotFoundException("Default role not found!")
        const user = this.userRepository.create({ ...createUserDto, roles: [defaultRole] });
        return await this.userRepository.save(user);
    }

    async findAll() {
        return await this.userRepository.find({ select: ["id", "image", "name", "email", "is_verified", "roles"], relations: ["roles"] });
    }

    async findOne(id: number, select: string[] = []) {
        const user = await this.userRepository.createQueryBuilder("user").leftJoinAndSelect("user.roles", "roles").where("user.id = :id", { id }).select(["user.id", "user.image", "user.name", "user.email", "roles", ...select]).getOne();

        if (!user) throw new NotFoundException("User not found!");
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);
        await this.userRepository.update(id, updateUserDto);
        return { message: "User updated successfully!" }
    }

    async remove(id: number) {
        await this.findOne(id);
        return await this.userRepository.delete(id);
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email }, relations: ["roles"] });
    }

    async uploadProfileImage(id: number, image: string) {
        await this.userRepository.update(id, { image });
        return { message: "Profile image uploaded successfully!" }
    }

    async removeProfileImage(id: number) {
        await this.userRepository.update(id, { image: null });
        return { message: "Profile image removed successfully!" }
    }
}
