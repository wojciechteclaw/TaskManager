import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import * as process from 'process';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Sample app API')
    .setDescription('This is the test API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
