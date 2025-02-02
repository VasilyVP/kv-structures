export type StructuredSetForEachOptions = {
    batchSize?: number;
};

export abstract class StructuredSet<T, Self extends StructuredSet<T, Self>> {
    readonly abstract name?: string;

    constructor(name?: string) { }

    abstract add(value: T): Promise<void>;
    abstract has(value: T): Promise<boolean>;
    abstract delete(value: T): Promise<void>;
    abstract clear(): Promise<void>;
    abstract size(): Promise<number>;

    abstract values(batchSize?: number): AsyncGenerator<T>;
    abstract keys(batchSize?: number): AsyncGenerator<T>; // Same as values()
    abstract entries(batchSize?: number): AsyncGenerator<[T, T]>; // Set entries return [value, value]

    abstract forEach(
        callbackfn: (value: T, set: Self) => Promise<void>,
        thisArg?: any,
        options?: StructuredSetForEachOptions,
    ): Promise<void>;

    abstract [Symbol.asyncIterator](): AsyncGenerator<T>;

    abstract intersection(other: Self, name?: string): Promise<Self>;
    abstract union(other: Self): Promise<Self>;
    abstract difference(other: Self): Promise<Self>;
    abstract symmetricDifference(other: Self): Promise<Self>;
    abstract isSubsetOf(other: Self): Promise<boolean>;
    abstract isSupersetOf(other: Self): Promise<boolean>;
    abstract isDisjointFrom(other: Self): Promise<boolean>;
}
