# @structured/redis

`@structured/redis` is a JavaScript library that provides an easy-to-use interface for interacting with Redis in a way that mimics the behavior of JavaScript `Map`. Currently, the package provides a `RedisMap` class, but more data structures (like `Set`) will be added in future releases.

## Installation

To install the package, run:

```bash
npm install @structured/redis
```

## Usage

Before using any methods in `@structured/redis`, you must call the `init()` method to initialize the Redis connection.

### Initialize the Package

At the beginning of your app, call the `init()` method to set up the Redis client.

```typescript
import { init, RedisMap } from '@structured/redis';

await init(); // Call this method once at the start of the app
```

### Creating a RedisMap

You can create a new `RedisMap` instance by optionally specifying a name for the map and a TTL (Time-To-Live) in milliseconds.

```typescript
const map = new RedisMap<string>('myMap', 60000); // Name and TTL (in ms)
```

If no name is provided, a random one will be generated. The TTL is optional.

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

### Iterating Over Keys

You can iterate over the keys of the map using the `keys` method. This returns an `AsyncGenerator` of keys.

```typescript
for await (const keys of map.keys()) {
  console.log(keys); // Array of keys for the current iteration
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

## Future Plans

More standard methods and data structures like `Set` will be added in future versions. The goal is to provide a comprehensive set of Redis-based data structures with a unified JavaScript structures API.

## License

MIT License. See [LICENSE](LICENSE) for more details.
