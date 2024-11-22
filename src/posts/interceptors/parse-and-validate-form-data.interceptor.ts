import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import { slugChanger } from 'src/helpers/slug-changer.helper';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class ParseAndValidateFormDataInterceptor<T extends ObjectLiteral> implements NestInterceptor {

    constructor(private readonly dto: new () => T) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

        const request = context.switchToHttp().getRequest();

        if (!request.body) throw new BadRequestException("No data found in the request body!");

        const stringifyBody = request.body.data;


        if (!stringifyBody) throw new BadRequestException("No data found in the request body!");

        const parsedBody = JSON.parse(stringifyBody);
        parsedBody.slug = slugChanger({ payload: parsedBody.title, addUUID: true })
        const data = plainToInstance(this.dto, parsedBody);


        const errors = await validate(data);
        if (errors?.length > 0) throw new BadRequestException(`Validation failed: ${errors}`);

        request.body = data;

        return next.handle();
    }
}
