import { expect } from "chai";

import { delayMs, benchmarkMs } from "./util";
import { LRUCachedGetter } from "../src";

describe("LRUCacheGetter", function() {
    it("shall be constructable", () => {
        const lru = createTestLRU();
    });

    it("shall retrieve cached values", async () => {
        const lru = createTestLRU();

        let ms = await benchmarkMs(async () => {
            const v = await lru.get(500);
            expect(v).equals("Test: 500");
        });
        expect(ms).within(490, 510);

        ms = await benchmarkMs(async () => {
            const v = await lru.get(500);
            expect(v).equals("Test: 500");
        });

        expect(ms).within(0, 50);
    });

    it("shall dispose of the least recently used value", async () => {
        const lru = createTestLRU();

        let ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expect(ms).within(90, 110);

        ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expect(ms).within(0, 10);

        for (let i = 0; i < 10; i++) {
            await lru.get(i);
        }

        ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expect(ms).within(90, 110);
    });
});

function createTestLRU(): LRUCachedGetter<number, string> {
    const lru = new LRUCachedGetter({
        getter: async (n: number) => {
            await delayMs(n);
            return `Test: ${n}`;
        },
        hasher: n => n.toString(),
        maxSize: 10
    });
    return lru;
}
