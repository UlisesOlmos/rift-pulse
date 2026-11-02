import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000, '0.0.0.0');
  console.log('Servidor escuchando en:', await app.getUrl());

}
void bootstrap();
