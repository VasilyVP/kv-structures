import type { RedisClient } from './init.ts';
import { redisInit, redisQuit, createClient, closeClient } from './init.ts';
import { RedisMap } from './RedisMap.ts';
import { RedisSet } from './RedisSet.ts';


export {
    redisInit, redisQuit,
    createClient, closeClient,
    RedisMap, RedisSet,
}

export type {
    RedisClient,
}
