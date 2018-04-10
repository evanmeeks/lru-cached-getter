# [@kwiwk/lru-cached-getter](https://github.com/kwiwk/lru-cached-getter)

A cache for asychnronous data.

[![Travis](https://img.shields.io/travis/kwiwk/lru-cached-getter.svg?style=flat-square)](https://travis-ci.org/kwiwk/lru-cached-getter)
[![npm](https://img.shields.io/npm/v/@kwiwk/lru-cached-getter.svg?style=flat-square)](https://www.npmjs.com/package/@kwiwk/lru-cached-getter)
[![npm](https://img.shields.io/npm/dt/@kwiwk/lru-cached-getter.svg)](https://www.npmjs.com/package/@kwiwk/lru-cached-getter)


## Table Of Contents
- [Description](#description)

## Description

The `LRUCachedGetter` is a way to cache asynchronous data 

## Documentation

```typescript

async function getPersonById(id: number): Promise<Person> { 
    // Get get a person by their ID asynchronously
}

async function personIdToString(id: number): string {
    return id.toString();
}

const lru = new LRUCachedGetter({
    getter: getPersonById, // A getter is a function that retrieves the value asynchronously
    hasher: personIdToString, // A hasher creates a unique string from the argument to represent the request.
    maxSize: 10, // Maximum size of LRU cache (defaults to 1000).
    expiresMs: 1000 * 60 * 60 * 24 // Milliseconds until the cached entry expires (defaults to Infinity).
});

// Request a person. Result is requested through the getter.
let person = await lru.get(1);

// ...

// Request a person. Result was previously cached and returned immediately.
person = await lru.get(1);

```

View the API docs [here](https://kwiwk.github.io/lru-cached-getter).

View the coverage report [here](https://kwiwk.github.io/lru-cached-getter/coverage).

## License

View the license [here](https://github.com/kwiwk/lru-cached-getter/blob/master/LICENSE.md).

## Changelog

View the changelog [here](https://github.com/kwiwk/lru-cached-getter/blob/master/CHANGELOG.md).


