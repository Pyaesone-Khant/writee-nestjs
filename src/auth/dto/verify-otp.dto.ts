import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {

    @IsNotEmpty({ message: "OTP is required!" })
    @IsString({ message: "Invalid OTP!" })
    otp: string;

    @IsNotEmpty({ message: "Email is required!" })
    @IsEmail()
    email: string;
}