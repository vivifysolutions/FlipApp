import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // configured using validation pipes 
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));
  // configure swagger 
  const config = new DocumentBuilder()
  .setTitle('Flip-App Api Endpoints')
  .setDescription('Flip-App API endpoints Documentation')
  .setVersion('1.0 ')
  .addTag('flip-app')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app, document);
  // end of configuring swagger 
  await app.listen(3000);
}
bootstrap();
