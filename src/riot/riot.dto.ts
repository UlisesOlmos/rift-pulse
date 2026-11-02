import { RiotQueueType, RiotRank, RiotTier } from "./riot.interface";

export interface RiotEntryParams {
    "division": RiotRank
    "tier": RiotTier
    "queue": RiotQueueType
    "page": number
}

export interface RiotMatchesParams {
    "startTime"?: number
    "endTime"?: number
    "queue"?: number
    "start": number //default 0
    "count": number //default 20
}