import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSavedblogDto {
  @IsNumber()
  @IsNotEmpty()
  blogId: number;
}
