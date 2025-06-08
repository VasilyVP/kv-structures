import { getClient } from './init.ts';

export class RedisBase {
    #name: string;

    protected get redis() {
        const client = getClient();

        if (!client) {
            throw Error('Redis client is not initialized. Call createClient() first.');
        }
        if (!client.CLIENT_ID) {
            throw Error('Redis client is not connected yet.');
        }

        return client;
    }

    get name(): string {
        return this.#name;
    }

    protected set name(value: string) {
        this.#name = value;
    }
}
