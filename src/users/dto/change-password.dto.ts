import { IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {

  @IsString()
  current_password: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}