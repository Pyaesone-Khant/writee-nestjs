import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class ChangeEmailProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async changeEmail(userId: number, email: string): Promise<object> {

        const userByEmail: User | undefined = await this.userRepository.findOne({
            where: { email }
        })

        if (userByEmail) {
            throw new ConflictException('Email already exists!');
        }

        const user: User | undefined = await this.userRepository.findOne({
            where: { id: userId }
        });

        user.email = email;

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return {
            success: true,
            message: 'Email changed successfully!',
        };
    }
}
