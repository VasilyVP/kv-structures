# @structured

## Overview

`@structured` is a repository of packages to provide native JavaScript data structures (`Map`, `Set`, etc.) for use with various storage engines. The goal of this repository is to offer an abstraction layer that allows developers to interact with different storage backends in the same way they would with built-in JavaScript structures, like `Map` or `Set`.

This package aims to create a seamless experience where you can store and retrieve data using familiar JavaScript APIs while leveraging the strengths of various storage systems, including Redis, Cloudflare KV, and more.

## Purpose

In modern applications, it's crucial to have a flexible and consistent way to interact with different types of storage engines. By providing a uniform API for data structures like `Map`, `Set`, and more, `@structured` helps you abstract away the underlying complexity of the storage engine, making it easier to switch or use multiple engines in the same application.

This package will include implementations for a variety of storage engines, starting with Redis, and will allow developers to work with data structures in a consistent, straightforward manner.

## Key Features

- **Unified API**: Interact with data structures like `Map`, `Set`, and others across different storage engines.
- **Flexible Storage Backends**: Start with Redis and expand to other engines like Cloudflare KV, and more.
- **Seamless Integration**: Easily integrate Redis-backed data structures (such as `RedisMap` and `RedisSet`) into your application.
- **Future-proof**: The library will grow to support more storage backends, providing the same intuitive API for each.

## Available engines
### [`@structured/redis`](https://github.com/VasilyVP/structured/tree/main/packages/redis)

This package is a Redis-specific package that implements Redis-backed data structures for use in JavaScript applications. You can think of [`@structured/redis`](https://github.com/VasilyVP/structured/tree/main/packages/redis) as one of the engines available through `@structured`.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
