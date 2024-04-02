import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)
        if (!user) throw new BadRequestException("Email or password is wrong!");

        const isPasswordMatch = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatch) throw new BadRequestException("Email or password is wrong!");
        return user;
    }

    async login(user: User) {
        const expiredAt = Date.now() + (24 * 60 * 60 * 1000);
        const payload = { email: user.email, id: user.id }
        return { accessToken: this.jwtService.sign(payload), expiredAt }
    }

    async register(user: CreateUserDto) {
        const isUserAlreadyExisted: User = await this.usersService.findByEmail(user.email);
        if (isUserAlreadyExisted) throw new BadRequestException("Email already exists!");
        const hashedPassword = await this.hashPassword(user.password)
        const newUser: CreateUserDto = { ...user, password: hashedPassword };
        return await this.usersService.create(newUser)
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }

}
