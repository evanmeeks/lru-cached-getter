export interface ConstructorArgs<TArg, TVal> {
    getter(arg: TArg): Promise<TVal>;
    hasher(arg: TArg): string;
    maxSize?: number;
    expiresMs?: number;
}

export interface CacheEntry<TVal> {
    lastUpdated: Date;
    lastUsed: Date;
    value: TVal;
}

export class LRUCachedGetter<TArg, TVal> {
    private getter: (arg: TArg) => Promise<TVal>;
    private hasher: (arg: TArg) => string;
    private cache: Map<string, CacheEntry<TVal>>;

    private maxSize: number;
    private expiresMs: number;

    constructor(args: ConstructorArgs<TArg, TVal>) {
        this.getter = args.getter;
        this.hasher = args.hasher;
        this.maxSize = args.maxSize || 1000;
        this.expiresMs = args.expiresMs || Infinity;
        this.cache = new Map();
    }

    /**
     * Get the value. Check the cache for a non-expired value, otherwise call getter function.
     */
    async get(arg: TArg, forceRefresh: boolean = false): Promise<TVal> {
        const key = this.hasher(arg);
        const cachedVal = this.cache.get(key);
        if (cachedVal !== undefined && !this._isDateExpired(cachedVal.lastUpdated) && !forceRefresh) {
            cachedVal.lastUsed = new Date();
            return cachedVal.value;
        }
        const newVal = await this._refresh(arg, key);
        this._cleanLRU();
        return newVal;
    }

    /**
     * Clear all cached values.
     */
    clear(): void {
        this.cache.clear();
    }

    private async _refresh(arg: TArg, key: string): Promise<TVal> {
        const newVal = await this.getter(arg);
        let nowDate = new Date();
        this.cache.set(key, {
            lastUpdated: nowDate,
            lastUsed: nowDate,
            value: newVal
        });
        return newVal;
    }

    private _cleanLRU(): void {
        while (this.cache.size >= this.maxSize) {
            const keyToDelete = this._getLRUKey();
            this.cache.delete(keyToDelete);
        }
    }

    private _getLRUKey(): string {
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

    private _isDateExpired(date: Date): boolean {
        return Date.now() - date.valueOf() >= this.expiresMs;
    }
}
