# @kv-structures/redis

`@kv-structures/redis` is a JavaScript library that provides an easy-to-use interface for interacting with Redis in a way that mimics the behavior of useful JavaScript data structures. Currently, the package provides a `RedisMap` and `RedisSet` classes, but more data structures (like `Array`) will be added in future releases.

## New in v2.0.0
  - Classes now support all native JavaScript `Map` and `Set` methods.
  - All methods return data in the same format as native JavaScript methods.
  - Added an optional parameter `batchSize` to manage blocking operations during iteration or clearing.

## Installation

To install the package, run:

```bash
npm install @kv-structures/redis
```

## Usage

### Initialize the Package

To initialize the Redis client and connect to the database, you must call the `createClient()` somewhere in the app.

```typescript
import { createClient } from '@kv-structures/redis';

await createClient(); // Call this method once at the start of the app
```

optionally you can provide standard `@redis/client` options:

```typescript
import { createClient } from '@kv-structures/redis';

await createClient({
  url: 'redis://localhost:6379',
});
```

All created maps internally share the same Redis connection.

### Close Redis connection

Optionally you can close Redis connection and reset the connection client.

```typescript
import { closeClient } from '@kv-structures/redis';

await closeClient();
```

### Creating a RedisMap

You can create a new `RedisMap` instance, optionally specifying a name for the map and an optional TTL (Time-To-Live) in milliseconds.

```typescript
const map = new RedisMap<string>('myMap', 60000); // Name and optional TTL (in ms)
```

If no name is provided, a random one will be generated (make sense only in case of a single instance). In this case, make sure to clear the map when the records are no longer needed. Otherwise, there is a risk of leaving keys and values in memory, which can lead to memory clutter.

### Setting a Value

Use the `set` method to add key-value pairs to the Redis map.

```typescript
await map.set('myKey', 'myValue');
```

You can also specify a custom TTL for individual key-value pairs:

```typescript
await map.set('myKey', 'myValue', 30000); // 30 seconds TTL
```

### Getting a Value

To retrieve a value, use the `get` method:

```typescript
const value = await map.get('myKey');
console.log(value); // 'myValue' or null if not found
```

### Iterating over the Map

There are several ways to iterate over the RedisMap. All methods return an `AsyncGenerator`.

```typescript
// Using keys
for await (const key of map.keys()) {
  console.log(`${key}: ${await map.get(key)}`);
}

// Using values
for await (const values of map.values(100)) { // 100 - optional batch size to force operation splitting internally for large records
    for (const value of values) {
        console.log(value);
    }
}

// Using forEach
await map.forEach(async (value, key, map) => {
    console.log(`${key}: ${value}`);
});

// Using for-await-of
for await (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

### Incrementing/Decrementing Values

You can increment or decrement numeric values stored in the map.

```typescript
await map.increment('counter'); // Increment by 1 (default)
await map.increment('counter', 5); // Increment by 5

await map.decrement('counter'); // Decrement by 1 (default)
await map.decrement('counter', 2.5); // Decrement by 2.5
```

### Using RedisSet

```typescript
const setA = new RedisSet("setA");
const setB = new RedisSet("setB");

await setA.add("value1");
await setA.add("value2");
await setB.add("value2");
await setB.add("value3");

const union = await setA.union(setB); // Set(["value1", "value2", "value3"])
const intersection = await setA.intersection(setB, "setIntersection"); // Set(["value2"])

await setA.clear();
await setB.clear();
await union.clear();
await intersection.clear();
```

## Tests

Note that the tests require Redis on localhost

```bash
npm run test
```

## Future Plans

More data structures like `Set` will be added in future versions. The goal is to provide a comprehensive set of Redis-based data structures with a unified JavaScript structures API.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
