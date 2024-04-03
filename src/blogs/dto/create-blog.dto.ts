import { IsArray, IsNotEmpty } from "class-validator";

export class CreateBlogDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    image?: any;

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsArray()
    category_ids: number[];
}
