import type { RedisClient } from './init.ts';
import { createClient, closeClient } from './init.ts';
import { RedisMap } from './RedisMap.ts';
import { RedisSet } from './RedisSet.ts';


export {
    createClient, closeClient,
    RedisMap, RedisSet,
}

export type {
    RedisClient,
}
