import { expect } from "chai";

export async function delayMs(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export async function benchmarkMs(func: () => Promise<void>): Promise<number> {
    const before = new Date();
    await func();
    const after = new Date();
    return after.valueOf() - before.valueOf();
}

export function expectCloseTo(actual: number, expected: number, tol: number): void {
    expect(actual).within(expected - tol, expected + tol);
}
