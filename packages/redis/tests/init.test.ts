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

    it("returns a Redis client instance and pass ping", async () => {
        const client = await createClient();
        expect(client).not.toBeNull();
        expect(client.CLIENT_ID).toBeDefined();

        const response = await client.ping();
        expect(response).toBe("PONG");
    });

    test("if getClient returns a redis client instance and pass ping", async () => {
        const client = getClient();
        expect(client).not.toBeNull();

        const response = await client!.ping();
        expect(response).toBe("PONG");
    });
});
