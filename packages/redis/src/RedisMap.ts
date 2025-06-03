import { randomBytes } from 'crypto';
import JsonBigInt from 'json-bigint';
import { StructuredMap, StructuredMapForEachOptions } from '@core/StructuredMap.ts';
import { RedisBase } from './RedisBase.ts';


export class RedisMap<V = any> extends RedisBase implements StructuredMap<string, V> {
    private readonly prefix = 'kv-map-';
    readonly ttl?: number;

    /**
     * 
     * @param name optional name of the key in Redis
     * @param ttl optional time to life in milliseconds
     */
    constructor(name?: string, ttl?: number) {
        super();
        this.name = name || this.prefix + randomBytes(8).toString('hex');
        this.ttl = ttl;
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

    private async *keyBatches(batchSize: number = 1000): AsyncGenerator<string[]> {
        let cursor = 0;

        do {
            const { cursor: newCursor, keys: prefixedKeys } = await this.redis.scan(cursor, {
                MATCH: `${this.name}:*`,
                COUNT: batchSize,
            });

            cursor = newCursor;

            if (prefixedKeys.length) yield prefixedKeys;
        } while (cursor !== 0);
    }

    async size(): Promise<number> {
        let count = 0;

        for await (const keys of this.keyBatches()) {
            count += keys.length;
        }

        return count;
    }

    async clear(batchSize: number = 1000) {
        for await (const keys of this.keyBatches(batchSize)) {
            if (keys.length) await this.redis.del(keys);
        }
    }

    async *keys(batchSize: number = 1000): AsyncGenerator<string> {
        for await (const keys of this.keyBatches(batchSize)) {
            for (const key of keys) {
                yield key.replace(`${this.name}:`, '');
            }
        }
    }

    async *values(batchSize: number = 100): AsyncGenerator<V> {
        for await (let keys of this.keyBatches(batchSize)) {
            const stringValues = await this.redis.mGet(keys);

            for await (const value of stringValues) {
                yield value ? JsonBigInt.parse(value) : null;
            }
        }
    }

    async *entries(batchSize: number = 100): AsyncGenerator<[string, V]> {
        for await (let keys of this.keyBatches(batchSize)) {
            const stringValues = await this.redis.mGet(keys);

            const values = stringValues.map(value => value ? JsonBigInt.parse(value) : null);

            const entries = keys.map((key, i) => [key.replace(`${this.name}:`, ''), values[i]] as [string, V]);

            for (const entry of entries) {
                yield entry;
            }
        }
    }

    async forEach(
        callbackfn: (value: V, key: string, map: StructuredMap<string, V>) => Promise<void>,
        thisArg?: any,
        { batchSize = 100 }: StructuredMapForEachOptions = {},
    ): Promise<void> {
        const boundCallback = thisArg ? callbackfn.bind(thisArg) : callbackfn;

        for await (const entry of this.entries(batchSize)) {
            const [key, value] = entry;
            await boundCallback(value, key, this);
        }
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<[string, V]> {
        for await (const entry of this.entries()) {
            yield entry;
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
