import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Matches(/^[a-z0-9_]*$/, { message: 'Username can only contain small letters, numbers and underscores!' })
    username: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak!' })
    password: string;
}
