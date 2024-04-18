import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    image: string;

    @IsNotEmpty()
    @IsArray()
    category_ids: number[];
}
