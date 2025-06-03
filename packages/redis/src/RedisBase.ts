import { getClient } from './init.ts';


export class RedisBase {
    #redis: ReturnType<typeof getClient> | null = null;
    #name: string;

    constructor() {
        this.#redis = getClient();
    }

    protected get redis() {
        if (!this.#redis || !this.#redis.CLIENT_ID) {
            throw Error('Redis client is not initialized. Call createClient() first.');
        }

        return this.#redis;
    }

    get name(): string {
        return this.#name;
    }

    protected set name(value: string) {
        this.#name = value;
    }
}
