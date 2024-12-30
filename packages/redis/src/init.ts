import { createClient, RedisClientOptions } from '@redis/client';

export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null;

export async function redisInit(options?: RedisClientOptions) {
    if (client) return client;

    client = createClient(options);
    client.on('error', err => console.error('Redis Client Error: ', err));
    await client.connect();
    return client;
}

export async function redisQuit() {
    await client?.quit();
    client = null;
}

export function getClient() {
    if (!client) {
        throw new Error('You should call redisInit() before');
    }

    return client;
}
