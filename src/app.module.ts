import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsModule } from './blogs/blogs.module';
import { BlogsService } from './blogs/blogs.service';
import { Blog } from './blogs/entities/blog.entity';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesService } from './categories/categories.service';
import { Category } from './categories/entities/category.entity';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
    imports: [
        UsersModule,
        CategoriesModule,
        BlogsModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User, Blog, Category]),
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
    ],
    controllers: [
        AppController,
        UsersController,
        CategoriesController,
        BlogsController
    ],
    providers: [
        AppService,
        UsersService,
        CategoriesService,
        BlogsService,
    ],
})
export class AppModule { }
