import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    image: any;

    @IsNotEmpty()
    @IsArray()
    category_ids: number[];
}
