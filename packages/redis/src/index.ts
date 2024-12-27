import type { RedisClient } from './init.ts';
import { redisInit, redisQuit } from './init.ts';
import { RedisMap } from './RedisMap.ts';


export {
    redisInit,
    redisQuit,
    RedisMap,
}

export type {
    RedisClient,
}
