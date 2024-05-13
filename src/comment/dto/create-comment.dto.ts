import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}
