import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Blog, Comment, Reaction, Role])],
    providers: [SeederService]
})
export class SeederModule { }
