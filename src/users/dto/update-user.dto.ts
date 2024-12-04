import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsOptional()
    profileImageUrl?: string;

    @IsString()
    @IsOptional()
    otp?: string;

    @IsOptional()
    @IsOptional()
    otpExpiration?: string;

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;
}
