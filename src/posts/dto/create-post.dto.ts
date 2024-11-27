import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    slug: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    content: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    description?: string;

    @IsOptional()
    @IsBoolean()
    published?: boolean = true;

    @IsOptional()
    @IsString()
    @MinLength(10)
    featuredImageUrl?: string;

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    categoryIds: number[];
}


