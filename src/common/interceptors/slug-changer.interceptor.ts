import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { slugChanger } from 'src/helpers/slug-changer.helper';

@Injectable()
export class SlugChangerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const request = context.switchToHttp().getRequest();
        const payload: string = request?.body?.name || request?.body?.title

        if (payload) {
            request.body.slug = slugChanger(payload)
        }

        return next.handle();
    }
}
