import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateReactionDto {
  @IsNumber()
  @IsNotEmpty()
  blogId: number;
}
