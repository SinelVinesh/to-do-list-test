import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
  if (!port) {
    throw new Error('Please set the PORT environment variable');
  }
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
