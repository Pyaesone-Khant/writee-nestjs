import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import { Blog } from 'src/blogs/entities/blog.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Reaction) private readonly reactionRepository: Repository<Reaction>,
    ) { }


    async seed() {
        await this.seedRoles();
        await this.seedUsers();
        await this.seedBlogs();
        await this.seedComments();
        await this.seedReactions();
    }

    private async seedRoles() {
        const roles = ["ADMIN", "USER"].map(role => {
            const newRole = new Role();
            newRole.name = role;
            return newRole
        })
        await this.roleRepository.save(roles)
    }

    private async seedUsers() {
        const roles = await this.roleRepository.find();
        const randomNumber = Math.floor(Math.random() * 5)
        const password = await bcrypt.hash("asdfghjkl", 10)
        for (let i = 0; i < 5; i++) {
            const user = new User();
            user.name = faker.person.fullName();
            user.email = faker.internet.email();
            user.password = password;
            user.is_active = true;
            user.is_verified = true;
            user.image = faker.image.url();
            user.roles = i === randomNumber ? roles : [roles[1]];
            await this.userRepository.save(user)
        }
    }

    private async seedBlogs() {
        const users = await this.userRepository.find();
        for (let i = 0; i < 10; i++) {
            const blog = new Blog();
            blog.title = faker.lorem.sentence();
            blog.description = faker.lorem.paragraphs();
            blog.user = users[Math.floor(Math.random() * users.length)]
            blog.slug = faker.lorem.slug();
            await this.blogRepository.save(blog)
        }
    }

    private async seedComments() {
        const blogs = await this.blogRepository.find();
        const users = await this.userRepository.find();
        for (let i = 0; i < 10; i++) {
            const comment = new Comment();
            comment.comment = faker.lorem.paragraph();
            comment.blog = blogs[Math.floor(Math.random() * blogs.length)]
            comment.user = users[Math.floor(Math.random() * users.length)]
            await this.commentRepository.save(comment)
        }
    }

    private async seedReactions() {
        const blogs = await this.blogRepository.find();
        const users = await this.userRepository.find();
        for (let i = 0; i < 10; i++) {
            const reaction = new Reaction();
            reaction.blog = blogs[Math.floor(Math.random() * blogs.length)]
            reaction.user = users[Math.floor(Math.random() * users.length)]
            await this.reactionRepository.save(reaction)
        }
    }
}
