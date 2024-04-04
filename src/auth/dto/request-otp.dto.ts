import { IsEmail, IsOptional } from "class-validator";

export class RequestOtpDto {

    @IsEmail()
    email: string;

    @IsOptional()
    @IsEmail()
    newEmail: string;
}