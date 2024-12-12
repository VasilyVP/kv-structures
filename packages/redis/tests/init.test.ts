import { describe, it, test, expect } from 'vitest';
import { getClient, init } from '../src/init.ts';


describe("init", () => {
    it("throw error when getClient wont return a redis client instance before init()", () => {
        expect(getClient).toThrow("You should call init() before");
    });

    it("returns a Redis client instance and pass ping", async () => {
        const client = await init();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });

    test("if getClient returns a redis client instance and pass ping", async () => {
        const client = getClient();
        const response = await client.ping();
        expect(response).toBe("PONG");
    });
});
