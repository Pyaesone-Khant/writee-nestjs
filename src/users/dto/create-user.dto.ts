import { IsEmail, IsNumberString, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    is_verified: boolean;

    @IsOptional()
    @IsNumberString()
    otp: string;

    @IsOptional()
    @IsNumberString()
    otp_expiration: string;
}
