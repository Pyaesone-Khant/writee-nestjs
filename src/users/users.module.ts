import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import AuthModule from "src/auth/auth.module";
import { AwsModule } from "src/aws/aws.module";
import { EmailModule } from "src/email/email.module";
import { RolesModule } from "src/roles/roles.module";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AwsModule,
        EmailModule,
        RolesModule,
        forwardRef(() => AuthModule) // auth module is imported to use the AuthService in BlogResponseInterceptor
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
