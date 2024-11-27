import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ChangeEmailProvider } from './providers/change-email.provider';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { ChangeUsernameProvider } from './providers/change-username.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindPostsByUserProvider } from './providers/find-posts-by-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { FindUserByUsernameProvider } from './providers/find-user-by-username.provider';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PaginationModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        FindUserByEmailProvider,
        FindUserByUsernameProvider,
        FindPostsByUserProvider,
        CreateUserProvider,
        ChangePasswordProvider,
        ChangeEmailProvider,
        ChangeUsernameProvider
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }
