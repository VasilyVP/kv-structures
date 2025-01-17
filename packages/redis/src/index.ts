import type { RedisClient } from './init.ts';
import { redisInit, redisQuit, createClient, closeClient } from './init.ts';
import { RedisMap } from './RedisMap.ts';


export {
    redisInit, redisQuit,
    createClient, closeClient,
    RedisMap,
}

export type {
    RedisClient,
}
