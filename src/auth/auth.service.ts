import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
    //this.jwtOptions = {
    //  secret: process.env.SECRET_KEY || "secret",
    //  verify: { algorithms: ['HS256'] }
    //}
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!this.comparePassword(password, user.password)) throw new BadRequestException('Invalid credentials!');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  async comparePassword(newPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compareSync(newPassword, passwordHash);
  }

}
