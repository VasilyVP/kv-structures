import { randomBytes } from 'crypto';
import JsonBigInt from 'json-bigint';
import { StructuredSet, StructuredSetForEachOptions } from '@core/StructuredSet.ts';
import { getClient } from './init.ts';


export class RedisSet<T = any> implements StructuredSet<T, RedisSet<T>> {
    private redis;
    readonly name: string;
    private readonly prefix = 'kv-set-';

    /**
     * 
     * @param name optional name of the key in Redis
     * @param ttl optional time to live in milliseconds for the whole Set
     */
    constructor(name?: string) {
        this.name = name || 'kv-set-' + randomBytes(8).toString('hex');
        this.redis = getClient();
    }

    async add(value: T): Promise<void> {
        await this.redis.sAdd(this.name, JsonBigInt.stringify(value));
    }

    async has(value: T): Promise<boolean> {
        return Boolean(await this.redis.sIsMember(this.name, JsonBigInt.stringify(value)));
    }

    async delete(value: T): Promise<void> {
        await this.redis.sRem(this.name, JsonBigInt.stringify(value));
    }

    async clear(): Promise<void> {
        await this.redis.del(this.name);
    }

    async size(): Promise<number> {
        return await this.redis.sCard(this.name);
    }

    async *values(batchSize: number = 1000): AsyncGenerator<T> {
        const scanIterator = this.redis.sScanIterator(this.name, {
            COUNT: batchSize,
        });

        for await (const member of scanIterator) {
            yield JsonBigInt.parse(member);
        }
    }

    async *keys(batchSize?: number): AsyncGenerator<T> {
        yield* this.values(batchSize);
    }

    async *entries(batchSize?: number): AsyncGenerator<[T, T]> {
        for await (const value of this.values(batchSize)) {
            yield [value, value];
        }
    }

    async forEach(
        callbackfn: (value: T, set: RedisSet<T>) => Promise<void>,
        thisArg?: any,
        { batchSize = 100 }: StructuredSetForEachOptions = {},
    ): Promise<void> {
        const boundCallback = thisArg ? callbackfn.bind(thisArg) : callbackfn;

        for await (const value of this.values(batchSize)) {
            await boundCallback(value, this);
        }
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<T> {
        yield* this.values();
    }

    async intersection(other: RedisSet<T>, name?: string): Promise<RedisSet<T>> {
        const intersectionName = name || this.prefix + randomBytes(8).toString('hex');

        await this.redis.sInterStore(intersectionName, [other.name, this.name]);
        return new RedisSet<T>(intersectionName);
    }

    private async intersectionSize(other: RedisSet<T>): Promise<number> {
        return await this.redis.sInterCard([this.name, other.name]);
    }

    async union(other: RedisSet<T>, name?: string): Promise<RedisSet<T>> {
        const unionName = name || this.prefix + randomBytes(8).toString('hex');

        await this.redis.sUnionStore(unionName, [this.name, other.name]);
        return new RedisSet<T>(unionName);
    }

    async difference(other: RedisSet<T>, name?: string): Promise<RedisSet<T>> {
        const differenceName = name || this.prefix + randomBytes(8).toString('hex');

        await this.redis.sDiffStore(differenceName, [this.name, other.name]);
        return new RedisSet<T>(differenceName);
    }

    async symmetricDifference(other: RedisSet<T>, name?: string): Promise<RedisSet<T>> {
        const differenceName = name || this.prefix + randomBytes(8).toString('hex');

        const [union, intersection] = await Promise.all([
            this.union(other),
            this.intersection(other),
        ]);

        const difference = await union.difference(intersection, differenceName);

        await Promise.all([union.clear(), intersection.clear()]);

        return difference;
    }

    async isSubsetOf(other: RedisSet<T>): Promise<boolean> {
        const [size, intersectionSize] = await Promise.all([
            this.size(),
            this.intersectionSize(other),
        ]);

        return size === intersectionSize;
    }

    async isSupersetOf(other: RedisSet<T>): Promise<boolean> {
        return await other.isSubsetOf(this);
    }

    async isDisjointFrom(other: RedisSet<T>): Promise<boolean> {
        return (await this.intersectionSize(other)) === 0;
    }
}
