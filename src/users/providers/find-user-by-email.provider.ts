import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindUserByEmailProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findUserByEmail(email: string): Promise<User> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: { email }
            })
        } catch (error) {
            throw new BadRequestException()
        }

        return user;
    }
}
