import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

interface GenericTypeEntity extends ObjectLiteral {
    'slug': string;
}

@Injectable()
export class FindDataBySlugProvider {

    async findDataBySlug<T extends GenericTypeEntity>(
        slug: string,
        repository: Repository<T>
    ): Promise<T | undefined> {
        let data: T | undefined;

        try {
            data = await repository.findOne({
                where: { slug: slug as any }
            })
        } catch (error) {
            throw new RequestTimeoutException()
        }

        return data;
    }

}
