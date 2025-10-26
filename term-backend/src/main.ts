import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`, // frontend URL
    credentials: true, // if you need cookies
  });
  await app.listen(process.env.BACKEND_PORT ?? 3001);
  console.log('listening at port: ', process.env.BACKEND_PORT ?? 3001);
}
bootstrap();
