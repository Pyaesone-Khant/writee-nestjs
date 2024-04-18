import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";

@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        response.status(status).json({
            statusCode: status,
            message: exception.message
        })

        super.catch(exception, host)
    }
}