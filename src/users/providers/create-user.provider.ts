import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByUsernameProvider } from './find-user-by-username.provider';

@Injectable()
export class CreateUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly hashingProvider: HashingProvider,

        private readonly findUserByEmailProvider: FindUserByEmailProvider,

        private readonly findUserByUsernameProvider: FindUserByUsernameProvider
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        let user: User | undefined;

        const userByEmail: User | undefined = await this.findUserByEmailProvider.findUserByEmail(createUserDto.email);

        if (userByEmail) {
            throw new BadRequestException('User with this email already exists');
        }

        const userByUsername: User | undefined = await this.findUserByUsernameProvider.findUserByUsername(createUserDto.username);

        if (userByUsername) {
            throw new BadRequestException('User with this username already exists');
        }

        try {
            user = this.userRepository.create({
                ...createUserDto,
                password: await this.hashingProvider.hashPassword(createUserDto.password)
            });

            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException('Failed to create user!');
        }

        return user;
    }

}
