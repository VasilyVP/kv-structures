import { randomBytes } from 'crypto';
import JsonBigInt from 'json-bigint';
import { StructuredMap } from '@core/StructuredMap.ts';
import { getClient } from './init.ts';


export class RedisMap<V> implements StructuredMap<string, V> {
    private redis;
    readonly name: string;
    readonly ttl?: number;

    /**
     * 
     * @param name optional name of the key in Redis
     * @param ttl optional time to life in milliseconds
     */
    constructor(name?: string, ttl?: number) {
        this.name = name || randomBytes(8).toString('hex');
        this.ttl = ttl;
        this.redis = getClient();
    }

    async set(key: string, value: V, ttl?: number) {
        await this.redis.set(`${this.name}:${key}`, JsonBigInt.stringify(value), {
            PX: ttl || this.ttl,
        });
    }

    async get(key: string): Promise<V | null> {
        const value = await this.redis.get(`${this.name}:${key}`);
        return value ? JsonBigInt.parse(value) : null;
    }

    async has(key: string): Promise<boolean> {
        return Boolean(await this.redis.exists(`${this.name}:${key}`));
    }

    async delete(key: string) {
        await this.redis.del(`${this.name}:${key}`);
    }

    async *keys(): AsyncGenerator<string[]> {
        let cursor = 0;

        do {
            const { cursor: newCursor, keys } = await this.redis.scan(cursor, {
                MATCH: `${this.name}:*`,
                COUNT: 1000,
            });

            cursor = newCursor;

            yield keys.map(key => key.replace(`${this.name}:`, ''));
        } while (cursor !== 0);
    }

    async size(): Promise<number> {
        let cursor = 0;
        let count = 0;

        do {
            const { cursor: newCursor, keys } = await this.redis.scan(cursor, {
                MATCH: `${this.name}:*`,
                COUNT: 1000,
            });

            count += keys.length;

            cursor = newCursor;
        } while (cursor !== 0);

        return count;
    }

    async clear() {
        for await (const keys of this.keys()) {
            const mapKeys = keys.map(key => `${this.name}:${key}`);
            await this.redis.del(mapKeys);
        }
    }

    async increment(key: string, value: number = 1) {
        if (Number.isInteger(value)) return await this.redis.incrBy(`${this.name}:${key}`, value);
        else return await this.redis.incrByFloat(`${this.name}:${key}`, value);
    }

    async decrement(key: string, value: number = 1) {
        if (Number.isInteger(value)) return await this.redis.decrBy(`${this.name}:${key}`, value);
        else return await this.redis.incrByFloat(`${this.name}:${key}`, -1 * value);
    }
}
