import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import { AwsService } from 'src/aws/aws.service';
import { Blog } from 'src/blogs/entities/blog.entity';
import { EmailService } from 'src/email/email.service';
import { generateOtp } from 'src/helpers/generateOtp';
import { MessageResponse } from 'src/helpers/message-response.dto';
import { RolesService } from 'src/roles/roles.service';
import { ILike, Repository } from 'typeorm';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly rolesService: RolesService,
        private readonly awsService: AwsService,
        private readonly emailService: EmailService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const defaultRole = await this.rolesService.findByRoleName("USER");
        if (!defaultRole) throw new NotFoundException("Default role not found!")
        const user = this.userRepository.create({ ...createUserDto, roles: [defaultRole] });
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({ relations: ["roles"] });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ["roles", "savedBlogs", "savedBlogs.blog", "savedBlogs.blog.user"] });
        if (!user) throw new NotFoundException("User not found!");
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);
        return await this.userRepository.update(id, updateUserDto);
    }

    async deactivateAccount(id: number, password: string): Promise<MessageResponse> {
        const user = await this.findOne(id);
        const isPwsCorrect = await bcrypt.compare(password, user.password);
        if (!isPwsCorrect) throw new BadRequestException("Password is incorrect!");

        const { otp, otp_expiration } = generateOtp()

        await this.emailService.sendEmail({
            subject: "Account Deactivation",
            user: {
                name: user.name,
                email: user.email
            },
            template: "./deactivate-account",
            otp,
        })

        user.otp = otp;
        user.otp_expiration = otp_expiration;
        await this.userRepository.save(user);
        return { message: "Please verify your email to deactivate account!" }
    }

    async verifyAccountDeactivation(id: number, otp: string): Promise<MessageResponse> {
        const user = await this.findOne(id);
        if (user.otp !== otp) {
            throw new BadRequestException("Invalid OTP!");
        }

        if (+user.otp_expiration < Date.now()) {
            throw new BadRequestException("OTP expired!");
        }

        user.email = "deactivated_" + user.email;
        user.otp = null;
        user.otp_expiration = null;
        user.is_active = false;
        await this.userRepository.save(user);
        return { message: "Account deactivated successfully!" }
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email }, relations: ["roles"] });
    }

    async changePassword(id: number, changePwsDto: ChangePasswordDto): Promise<MessageResponse> {
        const user = await this.findOne(id);

        const { password, current_password } = changePwsDto;

        if (!current_password || !password) {
            throw new NotFoundException("Please provide current password and new password!");
        }

        const isPasswordValid = await bcrypt.compare(current_password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException("Current password is incorrect!");
        }

        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            throw new NotFoundException("New password cannot be the same as the current password!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.update(id, { password: hashedPassword });
        return { message: "Password changed successfully!" }
    }

    async changeEmail(id: number, changeEmailDto: ChangeEmailDto): Promise<MessageResponse> {
        const { password, email: newEmail } = changeEmailDto;

        if (!password || !newEmail) {
            throw new BadRequestException("Please provide password and new email!");
        }

        const user = await this.findOne(id);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException("Password is incorrect!");
        }

        const isEmailExist = await this.findByEmail(newEmail);
        if (isEmailExist) {
            throw new BadRequestException("Email already exist!");
        }

        const { otp, otp_expiration } = generateOtp();
        const sendMailDto = {
            subject: "Email Verification",
            otp,
            user: {
                name: user.name,
                email: newEmail
            },
            template: "./verify",
        }

        await this.emailService.sendEmail(sendMailDto);
        await this.update(id, { email: newEmail, otp, otp_expiration, is_verified: false });
        return { message: "Please verify your new email address!" }
    }

    async resetPassword(changeEmailDto: ChangeEmailDto): Promise<MessageResponse> {
        const { email, password } = changeEmailDto

        const user = await this.findByEmail(email);
        if (!user) {
            throw new BadRequestException("User not found!");
        }

        if (!user.is_verified) {
            throw new BadRequestException("Email isn't verified yet!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.update(user.id, { password: hashedPassword });
        return { message: "Password reset successfully!" }
    }

    async uploadProfileImage(id: number, file: Express.Multer.File): Promise<MessageResponse> {
        if (!file) {
            throw new BadRequestException("Please upload a file");
        }

        const user = await this.findOne(id);
        if (user.image) {
            await this.awsService.deleteFile(user.image);
        }

        const image = await this.awsService.uploadFile(file);
        await this.userRepository.update(id, { image });
        return { message: "Profile image uploaded successfully!" }
    }

    async removeProfileImage(id: number): Promise<MessageResponse> {
        const user = await this.findOne(id);
        if (!user.image) throw new BadRequestException("User don't have profile image!");
        await this.awsService.deleteFile(user.image);
        await this.userRepository.update(id, { image: null });
        return { message: "Profile image removed successfully!" }
    }

    async findBlogs(id: number): Promise<Blog[]> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ["blogs", "blogs.categories", "blogs.user"] });
        return user.blogs;
    }

    async searchUsers(query: string): Promise<User[]> {
        return await this.userRepository.find({
            where: [
                { name: ILike(`%${query}%`) },
            ], relations: ["roles"]
        });
    }
}
