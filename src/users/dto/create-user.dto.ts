import { IsEmail, IsNumberString, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    image: string;

    is_verified: boolean;

    @IsOptional()
    @IsNumberString()
    otp: string;

    @IsOptional()
    otp_expiration: string;
}
