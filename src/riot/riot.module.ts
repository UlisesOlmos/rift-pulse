import { Module } from '@nestjs/common';
import { RiotService } from './riot.service';
import { HttpClientModule } from '@nestjs/http-client';


@Module({
    imports: [
        HttpClientModule.register({
            name: "riot",
            timeout: '5s',
        }),
    ],
    controllers: [],
    providers: [RiotService],
    exports: [RiotService]
})
export class RiotModule { }
