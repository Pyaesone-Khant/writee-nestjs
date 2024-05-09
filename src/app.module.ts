import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import AuthModule from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AwsModule } from './aws/aws.module';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsModule } from './blogs/blogs.module';
import { BlogsService } from './blogs/blogs.service';
import { Blog } from './blogs/entities/blog.entity';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesService } from './categories/categories.service';
import { Category } from './categories/entities/category.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { EmailModule } from './email/email.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { Role } from './roles/entities/role.entity';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { Savedblog } from './savedblogs/entities/savedblog.entity';
import { SavedblogsModule } from './savedblogs/savedblogs.module';
import { SearchModule } from './search/search.module';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        UsersModule,
        CategoriesModule,
        BlogsModule,
        AuthModule,
        RolesModule,
        CommentModule,
        SavedblogsModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([User, Blog, Category, Role, Comment, Savedblog]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: configService.get("DB_USER"),
                password: configService.get("DB_PASS"),
                database: configService.get("DB_NAME"),
                entities: ["dist/**/*.entity{.ts,.js}"],
                synchronize: true,
                autoLoadEntities: true
            }),
            inject: [ConfigService]
        }),
        EmailModule,
        AwsModule,
        SearchModule,
    ],
    controllers: [
        AppController,
        UsersController,
        CategoriesController,
        BlogsController,
        AuthController,
        RolesController,
    ],
    providers: [
        AppService,
        UsersService,
        CategoriesService,
        BlogsService,
        AuthService,
        RolesService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        JwtStrategy
    ],
})
export class AppModule { }
