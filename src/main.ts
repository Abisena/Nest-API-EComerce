import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  await app.listen(3000);
}
bootstrap();
