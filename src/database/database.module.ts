import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../config";
import { ConfigType } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.pg;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          autoLoadEntities: true,
          synchronize: false,
        }
      }
    })
  ]
})

export class DatabaseModule { }