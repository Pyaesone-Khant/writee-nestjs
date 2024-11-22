import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { PostsModule } from 'src/posts/posts.module';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { FindUserByUsernameProvider } from './providers/find-user-by-username.provider';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PaginationModule,
        forwardRef(() => PostsModule)
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        FindUserByEmailProvider,
        FindUserByUsernameProvider
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }
