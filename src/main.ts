import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`>>>>Api running on port: ${process.env.API_PORT} `);
  await app.listen(+process.env.API_PORT);
}
bootstrap();
