import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { FindDataBySlugProvider } from './common/providers/find-data-by-slug.provider';
import databaseConfig from './configs/database.config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { PaginationModule } from './common/pagination/pagination.module';

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
                databaseConfig
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
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
        FindDataBySlugProvider,
    ],
    exports: [
        FindDataBySlugProvider
    ]
})
export class AppModule { }
