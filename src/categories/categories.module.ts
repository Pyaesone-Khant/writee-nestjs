import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'src/auth/auth.module';
import { SavedblogsModule } from 'src/savedblogs/savedblogs.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        SavedblogsModule,
        AuthModule,
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule { }
