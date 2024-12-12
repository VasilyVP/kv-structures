import { createClient, RedisClientOptions } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient;

export async function init(options?: RedisClientOptions) {
    if (client) return client;

    client = createClient(options);
    client.on('error', err => console.error('Redis Client Error: ', err));
    await client.connect();
    return client;
}

export function getClient() {
    if (!client) {
        throw new Error('You should call init() before');
    }

    return client;
}
