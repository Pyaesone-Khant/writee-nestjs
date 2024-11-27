import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangeUsernameDto {

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    username: string;
}