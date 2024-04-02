import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './guards/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto
        const user = await this.authService.validateUser(email, password);
        return await this.authService.login(user)
    }

    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto)
    }
}
