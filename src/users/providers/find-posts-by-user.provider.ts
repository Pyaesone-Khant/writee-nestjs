import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindPostsByUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async findPostsByUser(username: string): Promise<User['posts']> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: {
                    username
                },
                relations: ['posts']
            });
        } catch (error) {
            throw new RequestTimeoutException('Request timeout');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.posts;
    }

}
