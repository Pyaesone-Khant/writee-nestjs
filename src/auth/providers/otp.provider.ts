import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { User } from 'src/users/user.entity';

@Injectable()
export class OtpProvider {

    constructor() { }

    async verifyOtp(user: User, otp: string) {
        if (Date.now() > parseInt(user.otpExpiration)) {
            throw new BadRequestException('OTP expired');
        }
        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }
        return true;
    }

    generateOtp() {
        const numberArr = new Uint32Array(10);
        const randomIndex = Math.floor(Math.random() * numberArr.length);
        const otp = crypto.getRandomValues(numberArr)[randomIndex].toString().slice(0, 6);
        const otpExpiration = (Date.now() + (1000 * 60 * 3)).toString();
        return { otp, otpExpiration };
    }
}
