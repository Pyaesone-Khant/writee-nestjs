import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { CategoriesModule } from './categories/categories.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { FindDataBySlugProvider } from './common/providers/find-data-by-slug.provider';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import { MailModule } from './mail/mail.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { SavedPostsModule } from './saved-posts/saved-posts.module';

const ENV = process.env.NODE_ENV || 'development';
@Global()
@Module({
    imports: [
        UsersModule,
        CategoriesModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: !ENV ? '.env' : `.env.${ENV}`,
            load: [
                databaseConfig,
                appConfig
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: "postgres",
                host: config.get("database.host"),
                port: config.get("database.port"),
                username: config.get("database.username"),
                password: config.get("database.password"),
                database: config.get("database.database"),
                synchronize: config.get("database.synchronize"),
                autoLoadEntities: config.get("database.autoLoadEntities"),
            }),
            inject: [ConfigService]
        }),
        PostsModule,
        PaginationModule,
        AuthModule,
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        SearchModule,
        MailModule,
        SavedPostsModule
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
        FindDataBySlugProvider,
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard
        },
        AccessTokenGuard
    ],
    exports: [
        FindDataBySlugProvider
    ]
})
export class AppModule { }
