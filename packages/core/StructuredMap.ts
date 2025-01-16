export type StructuredMapForEachOptions = {
    batchSize?: number;
}

export abstract class StructuredMap<K, V> {
    readonly abstract name?: string;

    constructor(name?: string) { }

    abstract set(key: K, value: V): Promise<void>;
    abstract get(key: K): Promise<V | null>;
    abstract has(key: K): Promise<boolean>;
    abstract delete(key: K): Promise<void>;
    abstract clear(): Promise<void>;
    abstract size(): Promise<number>;
    abstract keys(batchSize?: number): AsyncGenerator<K>;
    abstract values(batchSize?: number): AsyncGenerator<V>;
    abstract entries(batchSize?: number): AsyncGenerator<[K, V]>;

    abstract forEach(
        callbackfn: (value: V, key: K, map: StructuredMap<K, V>) => Promise<void>,
        thisArg?: any,
        options?: StructuredMapForEachOptions,
    ): Promise<void>;

    abstract [Symbol.asyncIterator](): AsyncGenerator<[K, V]>;
}
