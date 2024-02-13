import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './config/env/app.config';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Articles')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(AppConfig.SWAGGER_PREFIX || '/')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('apidoc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      startSwagger: true,
    },
  });

  app.use(cookieParser());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(AppConfig.PORT);
}
bootstrap();
