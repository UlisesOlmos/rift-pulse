import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || "localhost",
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    path.resolve(__dirname, '..') + '/**/entities/*.entity.ts',
    path.resolve(__dirname, '..') + '/**/entities/*.entity.js',
  ],
  migrations: [
    path.resolve(__dirname, '..') + '/**/migrations/*.ts',
    path.resolve(__dirname, '..') + '/**/migrations/*.js',
  ],
  migrationsTableName: 'migrations',
});
