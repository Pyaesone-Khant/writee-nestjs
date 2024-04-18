import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { BlogsModule } from 'src/blogs/blogs.module';
import { EmailModule } from 'src/email/email.module';
import { RolesModule } from 'src/roles/roles.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), BlogsModule, AwsModule,
        EmailModule, RolesModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
