import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotModule } from './riot/riot.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import config from './config';
import { CollectorsModule } from './collectors/collectors.module';
import { MatchesModule } from './matches/match.module';
import { BullModule } from '@nestjs/bullmq';
import { MatchCollectorModule } from './match-collectors/match-collectors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    DatabaseModule,
    MatchesModule,
    MatchCollectorModule,
    CollectorsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
