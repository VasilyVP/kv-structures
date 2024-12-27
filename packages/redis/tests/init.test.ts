import { describe, it, test, expect, afterAll } from 'vitest';
import { getClient, redisInit, redisQuit } from '../src/init.ts';


afterAll(async () => {
    redisQuit();
});

describe("Testing redisInit", () => {
    it("throw error when getClient wont return a redis client instance before redisInit()", () => {
        expect(getClient).toThrow("You should call redisInit() before");
    });

    it("returns a Redis client instance and pass ping", async () => {
        const client = await redisInit();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });

    test("if getClient returns a redis client instance and pass ping", async () => {
        const client = getClient();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });
});
