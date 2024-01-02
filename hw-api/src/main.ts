import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MongoErrorFilter } from './shared/filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('hw-api/v1');

    app.useGlobalFilters(new MongoErrorFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const config = new DocumentBuilder()
        .setTitle('HW API')
        .setDescription('API for HW')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();