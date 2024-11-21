import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PaginationModule
    ],
    controllers: [UsersController],
    providers: [UsersService, FindUserByEmailProvider],
})
export class UsersModule { }
