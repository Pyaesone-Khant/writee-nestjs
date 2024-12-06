import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindPopularAuthorsProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async findPopularAuthors(): Promise<User[]> {
        let users: User[] | undefined;

        try {
            users = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.posts', 'post')
                .loadRelationCountAndMap('user.postCount', 'user.posts')
                .getMany()
                .then(users => {
                    return users.filter(user => user.postCount > 0)
                        .slice(0, 5)
                        .sort((a, b) => b.postCount - a.postCount);
                })
        } catch (error) {
            throw new RequestTimeoutException(error);
        }

        return users;
    }

}
