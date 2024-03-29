import { Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

type ResponseObj = {
    statusCode: number;
    response: string | object
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: any) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception.getStatus();
        const errorResponse: ResponseObj = {
            statusCode: status,
            response: exception.getResponse()
        }

        console.log('status', status)
        console.log('errorResponse', errorResponse)

        response.status(status).json({
            ...errorResponse,
            timestamp: new Date().toISOString(),
            path: request.url
        })
    }
}