import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}
