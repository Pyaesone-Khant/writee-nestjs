import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dto/sign-in.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly signInProvider: SignInProvider,

        private readonly usersService: UsersService
    ) { }

    async signIn(signInDto: SignInDto) {
        return this.signInProvider.signIn(signInDto);
    }

    async signUp(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

}
