import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.useGlobalFilters(new AllExceptionsFilter())
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }))
    app.enableCors();
    app.setGlobalPrefix("api")
    await app.listen(3000);
}
bootstrap();
