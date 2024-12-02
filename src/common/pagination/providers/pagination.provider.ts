import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Paginated } from '../interface/paginated.interface';

@Injectable()
export class PaginationProvider {

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>
    ): Promise<Paginated<T>> {
        const { page, limit } = paginationQuery;

        const data = await repository.find({
            take: limit,
            skip: (page - 1) * limit,
            order: {
                id: "DESC" as any
            }
        })

        const totalItems = await repository.count();

        const response: Paginated<T> = {
            data,
            meta: {
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                itemsPerPage: limit
            }
        }

        return response;
    }
}
