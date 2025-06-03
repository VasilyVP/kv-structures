import { describe, it, test, expect, afterAll } from 'vitest';
import { createClient, closeClient, getClient } from '../src/init.ts';


afterAll(async () => {
    await closeClient();
});

describe("Testing redisInit", () => {
    it("throw error when getClient wont return a redis client instance before createClient()", async () => {
        expect(getClient).toThrowError(Error);
    });

    it("returns a Redis client instance and pass ping", async () => {
        const client = await createClient();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });

    test("if getClient returns a redis client instance and pass ping", async () => {
        const client = await getClient();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });
});
