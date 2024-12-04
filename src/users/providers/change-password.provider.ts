import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '../user.entity';

@Injectable()
export class ChangePasswordProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly hashingProvider: HashingProvider,
    ) { }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<object> {
        const user: User | undefined = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (this.hashingProvider.comparePassword(changePasswordDto.oldPassword, user.password)) {
            throw new BadRequestException('Old password is incorrect!');
        }

        if (changePasswordDto.oldPassword !== user.password) {
            throw new BadRequestException('Old password is incorrect!');
        }

        user.password = await this.hashingProvider.hashPassword(changePasswordDto.newPassword);

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException('Password could not be updated!');
        }

        return {
            success: true,
            message: 'Password updated successfully!',
        };
    }

    async resetPassword(email: string, password: string): Promise<object> {
        const user: User | undefined = await this.userRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new BadRequestException('User not found!');
        }

        user.password = await this.hashingProvider.hashPassword(password);

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new RequestTimeoutException('Password could not be updated!');
        }

        return {
            success: true,
            message: 'Password updated successfully!',
        };
    }
}
