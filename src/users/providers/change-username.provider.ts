import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeUsernameDto } from '../dto/change-username.dto';
import { User } from '../user.entity';
import { FindUserByUsernameProvider } from './find-user-by-username.provider';

@Injectable()
export class ChangeUsernameProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly findUserByUsernameProvider: FindUserByUsernameProvider,
    ) { }

    async changeUsername(userId: number, changeUsernameDto: ChangeUsernameDto): Promise<object> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        const userByUsername = await this.findUserByUsernameProvider.findUserByUsername(changeUsernameDto.username);

        if (userByUsername) {
            throw new ConflictException('Username already exists!');
        }

        user.name = changeUsernameDto.name ?? user.name;
        user.username = changeUsernameDto.username ?? user.username;

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return {
            success: true,
            message: 'Username updated successfully!',
        };
    }
}
