import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    slug: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    description?: string;
}
