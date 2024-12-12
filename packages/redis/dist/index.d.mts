declare abstract class StructuredMap<K, V> {
    readonly name?: string | undefined;
    constructor(name?: string | undefined);
    abstract set(key: K, value: V): Promise<void>;
    abstract get(key: K): Promise<V | null>;
    abstract has(key: K): Promise<boolean>;
    abstract delete(key: K): Promise<void>;
    abstract clear(): Promise<void>;
    abstract keys(): AsyncGenerator<K[]>;
    abstract size(): Promise<number>;
}

declare class RedisMap<V> implements StructuredMap<string, V> {
    readonly name?: string | undefined;
    readonly ttl?: number | undefined;
    private redis;
    constructor(name?: string | undefined, ttl?: number | undefined);
    set(key: string, value: V, ttl?: number): Promise<void>;
    get(key: string): Promise<V | null>;
    has(key: string): Promise<boolean>;
    delete(key: string): Promise<void>;
    keys(): AsyncGenerator<string[]>;
    size(): Promise<number>;
    clear(): Promise<void>;
    increment(key: string, value?: number): Promise<string | number>;
    decrement(key: string, value?: number): Promise<string | number>;
}

export { RedisMap };
