# @kv-structures

## Overview

`@kv-structures` is a repository of packages to provide native JavaScript data structures (`Map`, `Set`, etc.) for use with various storage engines. The goal of this repository is to offer an abstraction layer that allows developers to interact with different storage backends in the same way they would with built-in JavaScript structures, like `Map` or `Set`.

This package aims to create a seamless experience where you can store and retrieve data using familiar JavaScript APIs while leveraging the strengths of various storage systems, including Redis, Cloudflare KV, and more.

## Purpose

In modern applications, it's crucial to have a flexible and consistent way to interact with different types of storage engines. By providing a uniform API for data structures like `Map`, `Set`, and more, `@kv-structures` helps you abstract away the underlying complexity of the storage engine, making it easier to switch or use multiple engines in the same application.

This package will include implementations for a variety of storage engines, starting with Redis, and will allow developers to work with data structures in a consistent, straightforward manner.

## Key Features

- **Unified API**: Interact with data structures like `Map`, `Set`, and others across different storage engines.
- **Flexible Storage Backends**: Start with Redis and expand to other engines like Cloudflare KV, and more.
- **Seamless Integration**: Easily integrate Redis-backed data structures (such as `RedisMap` and `RedisSet`) into your application.
- **Future-proof**: The library will grow to support more storage backends, providing the same intuitive API for each.

## Installation

To install the whole package, add to the `.npmrc`
```bash
@vasilyvp:registry=https://npm.pkg.github.com/
```

and run:

```bash
npm install @vasilyvp/kv-structures
```
## Usage

```typescript
import { redisInit, redisQuit, RedisMap } from '@vasilyvp/kv-structures';

await redisInit(); // Call this method once at the start of the app

const map = new RedisMap<string>('myMap', 60000); // Name and optional TTL (in ms)

await map.set('myKey', 'myValue');
const value = await map.get('myKey'); // 'myValue'

await redisQuit();
```

Refer to the specific engine's documentation for more details.

## Available specific engines
### [`@kv-structures/redis`](https://github.com/VasilyVP/kv-structures/tree/main/packages/redis)

This package is a Redis-specific package that implements Redis-backed data structures for use in JavaScript applications. You can think of [`@kv-structures/redis`](https://github.com/VasilyVP/kv-structures/tree/main/packages/redis) as one of the engines available through `@kv-structures`.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
