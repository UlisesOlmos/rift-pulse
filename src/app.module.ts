import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotModule } from './riot/riot.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    RiotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
