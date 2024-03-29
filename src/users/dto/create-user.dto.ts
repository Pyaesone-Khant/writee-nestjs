export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    image: string;
    is_verified: boolean;
    otp: string;
    otp_expiration: string;
}
