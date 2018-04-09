export interface LRUCachedGetterConstructorArgs<TArgs, TVal> {
    getter(args: TArgs): Promise<TVal>;
    hasher(args: TArgs): string;
    maxSize?: number;
}

export class LRUCachedGetter<TArgs, TVal> {
    getter: (args: TArgs) => Promise<TVal>;
    hasher: (args: TArgs) => string;
    cache: Map<
        string,
        {
            lastUsed: Date;
            value: TVal;
        }
    >;

    private maxSize: number;

    constructor(args: LRUCachedGetterConstructorArgs<TArgs, TVal>) {
        this.getter = args.getter;
        this.hasher = args.hasher;
        this.maxSize = args.maxSize || 1000;
        this.cache = new Map();
    }

    async get(args: TArgs): Promise<TVal> {
        const key = this.hasher(args);
        const cachedVal = this.cache.get(key);
        if (cachedVal !== undefined) {
            cachedVal.lastUsed = new Date();
            return cachedVal.value;
        }

        const newVal = await this.getter(args);
        this.cache.set(key, {
            lastUsed: new Date(),
            value: newVal
        });

        while (this.cache.size >= this.maxSize) {
            const keyToDelete = this.getLRUKey();
            this.cache.delete(keyToDelete);
        }
        return newVal;
    }

    lastUsed(args: TArgs): Date | undefined {
        const key = this.hasher(args);
        const cachedVal = this.cache.get(key);
        if (cachedVal === undefined) return;

        return cachedVal.lastUsed;
    }

    isCached(args: TArgs): boolean {
        const key = this.hasher(args);
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.clear();
    }

    private getLRUKey(): string {
        let lruKey: string | undefined;
        let lruDate = new Date();

        for (const [k, v] of this.cache.entries()) {
            if (v.lastUsed < lruDate) {
                lruKey = k;
                lruDate = v.lastUsed;
            }
        }

        if (lruKey === undefined) {
            throw new Error("No entries have been least recently used");
        }
        return lruKey;
    }
}
