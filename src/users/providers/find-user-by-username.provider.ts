import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindUserByUsernameProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findUserByUsername(username: string): Promise<User | undefined> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: { username }
            })
        } catch (error) {
            throw new RequestTimeoutException();
        }

        return user;
    }

}
