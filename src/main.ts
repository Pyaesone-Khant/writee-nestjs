import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //   const {httpAdapter} = app.get(HttpAdapterHost)
    //   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.enableCors();
    app.setGlobalPrefix("api")

    await app.listen(3000);
}
bootstrap();
