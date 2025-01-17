import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { createClient, closeClient, RedisMap } from '../dist/index.mjs';
import type { RedisClient } from '../dist/index.d.mts';


let client: RedisClient;

const mapName = "testRedisMap";

beforeAll(async () => {
    client = await createClient();
});

beforeEach(async () => {
    const map = new RedisMap(mapName);
    await map.clear();
});

afterAll(async () => {
    const map = new RedisMap(mapName);
    await map.clear();

    await closeClient();
});

describe("Testing /redis package build", () => {
    test("redisInit() returns a client", async () => {
        expect(client).toBeDefined();
    });

    test("RedisMap is defined", async () => {
        const map = new RedisMap(mapName);
        expect(map).toBeDefined();
    });

    test("set() and get() works", async () => {
        const map = new RedisMap(mapName);
        await map.set("key", "value");
        const value = await map.get("key");
        expect(value).toBe("value");
    });
});
