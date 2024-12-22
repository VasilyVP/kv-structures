export abstract class StructuredMap<K, V> {
    readonly abstract name?: string;

    constructor(name?: string) { }

    abstract set(key: K, value: V): Promise<void>;
    abstract get(key: K): Promise<V | null>;
    abstract has(key: K): Promise<boolean>;
    abstract delete(key: K): Promise<void>;
    abstract clear(): Promise<void>;
    abstract keys(): AsyncGenerator<K[]>;
    abstract size(): Promise<number>;
}
