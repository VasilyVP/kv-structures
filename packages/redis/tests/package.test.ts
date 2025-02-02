import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { createClient, closeClient, RedisMap, RedisSet } from '../dist/index.mjs';
import type { RedisClient } from '../dist/index.d.mts';


let client: RedisClient;

const mapName = "testRedisMapPackage";
const setName = "testRedisSetPackage";

beforeAll(async () => {
    client = await createClient();
});

beforeEach(async () => {
    const map = new RedisMap(mapName);
    await map.clear();

    const set = new RedisSet(setName);
    await set.clear();
});

afterAll(async () => {
    const map = new RedisMap(mapName);
    await map.clear();

    const set = new RedisSet(setName);
    await set.clear();

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

    test("RedisSet is defined", async () => {
        const set = new RedisSet(setName);
        expect(set).toBeDefined();
    });

    test("RedisSet add() and has() works", async () => {
        const set = new RedisSet(setName);
        await set.add("value");
        const hasValue = await set.has("value");
        expect(hasValue).toBe(true);
    });
});
