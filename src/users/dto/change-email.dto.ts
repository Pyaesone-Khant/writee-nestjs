import { IsString } from "class-validator";

export class ChangeEmailDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}