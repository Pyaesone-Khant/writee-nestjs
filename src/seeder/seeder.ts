import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeder.module";
import { SeederService } from "./seeder.service";

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const seeder = appContext.get(SeederService);

    await seeder.seed();
    await appContext.close();
}

bootstrap();