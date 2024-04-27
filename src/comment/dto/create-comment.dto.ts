import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  blog_id: number;
}
