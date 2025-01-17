import { createClient as redisCreateClient, RedisClientOptions } from '@redis/client';

export type RedisClient = ReturnType<typeof redisCreateClient>;

let client: RedisClient | null;

/**
 * @deprecated Use `createClient` instead
 */
export async function redisInit(options?: RedisClientOptions) {
    if (client) return client;

    client = redisCreateClient(options);
    client.on('error', err => console.error('Redis Client Error: ', err));
    await client.connect();
    return client;
}

/**
 * @description Create a Redis client instance
 */
export async function createClient(options?: RedisClientOptions) {
    if (client) return client;

    client = redisCreateClient(options);
    client.on('error', err => console.error('Redis Client Error: ', err));
    await client.connect();
    return client;
}

/**
 * @deprecated Use `closeClient` instead
 */
export async function redisQuit() {
    await client?.quit();
    client = null;
}

/**
 * @description Gracefully closes the Redis client instance
 */
export async function closeClient() {
    await client?.quit();
    client = null;
}

/**
 * @description Get already created the Redis client instance
 * @returns Redis client instance
 * @throws Error if the client is not created yet
 */
export function getClient() {
    if (!client) {
        throw new Error('You should call createClient() before');
    }

    return client;
}
