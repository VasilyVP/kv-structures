import { describe, it, test, expect, afterAll } from 'vitest';
import { createClient, closeClient, getClient } from '../src/init.ts';


afterAll(async () => {
    await closeClient();
});

describe("Testing redisInit", () => {
    it("getClient return null if createClient was not called before", async () => {
        const client = getClient();
        expect(client).toBeNull();
    });

    test("createClient creates a Redis client instance", async () => {
        const client = await createClient();

        expect(client).not.toBeNull();
        expect(client.CLIENT_ID).toBeDefined();
    });

    test("getClient returns Redis client and it pass ping", async () => {
        const client = getClient();

        expect(client).not.toBeNull();
        expect(client!.CLIENT_ID).toBeDefined();

        const response = await client!.ping();
        expect(response).toBe("PONG");
    });

    test("if getClient returns a redis client instance and pass ping", async () => {
        const client = getClient();
        expect(client).not.toBeNull();

        const response = await client!.ping();
        expect(response).toBe("PONG");
    });

    test("getClient returns the the redis client instance", async () => {
        const client = getClient();

        expect(client).toBeDefined();
        expect(client!.CLIENT_ID).toBeDefined();
    });

    test("closeClient closes the Redis client instance", async () => {
        const client1 = getClient();
        expect(client1).not.toBeNull();

        await closeClient();
        const client2 = getClient();

        expect(client2).toBeNull();
    });
});
