import { IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak!' })
    newPassword: string;
}