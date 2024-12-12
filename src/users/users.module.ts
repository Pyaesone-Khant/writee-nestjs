import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ChangeEmailProvider } from './providers/change-email.provider';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { ChangeUsernameProvider } from './providers/change-username.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindPostsByUserProvider } from './providers/find-posts-by-user.provider';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { FindPopularAuthorsProvider } from './providers/find-popular-authors.provider';
import { LikePostsProvider } from './providers/like-posts.provider';
import { SavePostsProvider } from './providers/save-posts.provider';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PaginationModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        FindPostsByUserProvider,
        CreateUserProvider,
        ChangePasswordProvider,
        ChangeEmailProvider,
        ChangeUsernameProvider,
        FindPopularAuthorsProvider,
        LikePostsProvider,
        SavePostsProvider,
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }
