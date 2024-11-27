import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async comparePassword(
        data: string | Buffer,
        encrypted: string
    ): Promise<boolean> {
        return bcrypt.compare(data, encrypted)
    }

}
