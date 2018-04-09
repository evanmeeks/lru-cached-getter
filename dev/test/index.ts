import { expect } from "chai";

import { delayMs, benchmarkMs, expectCloseTo } from "./util";
import { LRUCachedGetter } from "../src";

const MS_TOL = 10;

describe("LRUCacheGetter", function() {
    it("shall be constructable", () => {
        const lru = createTestLRU();
        expect(lru).to.exist;
    });

    it("shall retrieve cached values", async () => {
        const lru = createTestLRU();

        let ms = await benchmarkMs(async () => {
            const v = await lru.get(500);
            expect(v).equals("Test: 500");
        });
        expectCloseTo(ms, 500, MS_TOL);

        ms = await benchmarkMs(async () => {
            const v = await lru.get(500);
            expect(v).equals("Test: 500");
        });
        expectCloseTo(ms, 0, MS_TOL);
    });

    it("shall refresh when provided a forceRefresh flag", async() => {
        const lru = createTestLRU();

        let ms = await benchmarkMs(async() => {
            const v = await lru.get(50);
            expect(v).equals("Test: 50");
        });
        expectCloseTo(ms, 50, MS_TOL);

        ms = await benchmarkMs(async() => {
            const v = await lru.get(50, true);
            expect(v).equals("Test: 50");
        });
        expectCloseTo(ms, 50, MS_TOL);


    });

    it("shall dispose of the least recently used value", async () => {
        const lru = createTestLRU();

        let ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expectCloseTo(ms, 100, MS_TOL);

        ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expect(ms).within(0, MS_TOL);

        for (let i = 0; i < 10; i++) {
            await lru.get(i);
        }

        ms = await benchmarkMs(async () => {
            const v = await lru.get(100);
            expect(v).equals("Test: 100");
        });
        expectCloseTo(ms, 100, MS_TOL);
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
