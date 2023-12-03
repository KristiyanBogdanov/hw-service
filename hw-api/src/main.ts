import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MongoErrorFilter } from './shared/filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('hw-api/v1');

    app.useGlobalFilters(new MongoErrorFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.listen(3000);
}
bootstrap();