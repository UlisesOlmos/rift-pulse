import { Module } from "@nestjs/common";
import { CollectorsService } from "./collectors.service";
import { RiotModule } from "../riot/riot.module";
import { CollectorController } from "./collectors.controller";
import { PlayersModule } from "../players/player.module";
import { BullModule } from "@nestjs/bullmq";
import { CollectorsProcessor } from "./collectors.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionCursor } from "./entities/collector-cursor.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CollectionCursor,
        ]),
        RiotModule,
        PlayersModule,
        BullModule.registerQueue({
            name: 'player-collection',
        }),
    ],
    providers: [
        CollectorsService,
        CollectorsProcessor
    ],
    controllers: [CollectorController]
})
export class CollectorsModule { }