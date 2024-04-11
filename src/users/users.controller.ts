import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
import { AwsService } from 'src/aws/aws.service';
import { BlogsService } from 'src/blogs/blogs.service';
import { Public } from 'src/decorators/public.decorator';
import { EmailService } from 'src/email/email.service';
import { fileFilter } from 'src/helpers/fileFilter';
import { generateOtp } from 'src/helpers/generateOtp';
import { UsersService } from './users.service';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly blogsService: BlogsService,
        private readonly awsService: AwsService,
        private readonly emailService: EmailService,
    ) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('currentUser')
    async currentUser(@Req() request: any) {
        const userId = request?.user?.id;
        return this.usersService.findOne(+userId, ["user.id", "user.name", "user.email", "user.image"]);
    }

    @Public()
    @Get(':id/blogs')
    findBlogs(@Param('id') id: string) {
        return this.blogsService.findByUser(+id);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);

    }

    @Patch('changeName')
    changeName(@Req() request: any, @Body() payload: { name: string }) {
        const userId = request?.user?.id;
        return this.usersService.update(+userId, payload);
    }

    @Patch('changePassword')
    async changePassword(@Req() request: any, @Body() payload: { current_password: string, password: string }) {
        const { id: userId } = request?.user
        const { password, current_password } = payload;
        if (!current_password || !password) {
            throw new BadRequestException("Please provide current password and new password!");
        }

        const user = await this.usersService.findOne(+userId);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const isPasswordMatched = await bcrypt.compare(current_password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException("Current password is incorrect!");
        }

        const isNewPasswordMatched = await bcrypt.compare(password, user.password);
        if (isNewPasswordMatched) {
            throw new BadRequestException("New password can't be same as current password!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.usersService.update(+userId, { password: hashedPassword });
        return { message: "Password updated successfully!" }
    }

    @Patch('changeEmail')
    async changeEmail(@Req() request: any, @Body() payload: { email: string, password: string }) {
        const { id: userId } = request?.user
        const { password, email: newEmail } = payload;

        if (!password || !newEmail) {
            throw new BadRequestException("Please provide password and new email!");
        }

        const user = await this.usersService.findOne(+userId);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException("Password is incorrect!");
        }

        const isEmailExist = await this.usersService.findByEmail(newEmail);
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
            }
        }

        await this.emailService.sendEmail(sendMailDto);
        await this.usersService.update(+userId, { email: newEmail, otp, otp_expiration, is_verified: false });
        return { message: "Please verify your new email address!" }
    }

    @Patch("resetPassword")
    async resetPassword(@Body() payload: { email: string, password: string }) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user || !user.is_verified) {
            throw new BadRequestException("User not found or email not verified!");
        }
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        await this.usersService.update(user.id, { password: hashedPassword });
        return { message: "Password reset successfully!" }
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }))
    async uploadProfileImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
        const userId = request?.user?.id;
        if (!file) {
            throw new BadRequestException("Please upload a file");
        }
        const image = await this.awsService.uploadFile(file);;
        return this.usersService.uploadProfileImage(+userId, image);
    }
}
