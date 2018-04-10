# [@kwiwk/lru-cached-getter](https://github.com/kwiwk/lru-cached-getter)

![Kwiwk Logo](https://raw.githubusercontent.com/kwiwk/kwiwk.github.io/master/logo.svg)

A cache for asychnronous data.

[![Travis](https://img.shields.io/travis/kwiwk/lru-cached-getter.svg?style=flat-square)](https://travis-ci.org/kwiwk/lru-cached-getter)
[![npm](https://img.shields.io/npm/v/@kwiwk/lru-cached-getter.svg?style=flat-square)](https://www.npmjs.com/package/@kwiwk/lru-cached-getter)
[![npm](https://img.shields.io/npm/dt/@kwiwk/lru-cached-getter.svg)](https://www.npmjs.com/package/@kwiwk/lru-cached-getter)


## Table Of Contents
- [Description](#description)
- [Documentation](#documentation)
- [License](#license)
- [Changelog](#changelog)

## Description

LRUCachedGetter will cache results retrieved through its getter function for faster access on subsequent calls. 

Features:
- Configurable expiration time
- Configurable LRU cache size
- Force updating

## Documentation

```typescript
import { LRUCachedGetter } from "@kwiwk/lru-cached-getter";

async function getPersonById(id: number): Promise<Person> { 
    // Get get a person by their ID asynchronously
}

async function personIdToString(id: number): string {
    return id.toString();
}

// Create a new LRU cache
const lru = new LRUCachedGetter({
    // A getter is a function that retrieves the value asynchronously
    getter: getPersonById, 

    // A hasher creates a unique string from the argument to represent the request.
    hasher: personIdToString, 

    // Maximum size of LRU cache (defaults to 1000).
    maxSize: 10,

    // Milliseconds until the cached entry expires (defaults to Infinity).
    expiresMs: 1000 * 60 * 60 * 24
});

// Request a person. Result is requested through the getter.
let person = await lru.get(1);

// ...

// Result was previously cached and returned immediately.
person = await lru.get(1);

// Force the value to be retrieved through the getter.
person = await lru.get(1, true);

```

View the API docs [here](https://kwiwk.github.io/lru-cached-getter).

View the coverage report [here](https://kwiwk.github.io/lru-cached-getter/coverage).

## License

View the license [here](https://github.com/kwiwk/lru-cached-getter/blob/master/LICENSE.md).

## Changelog

View the changelog [here](https://github.com/kwiwk/lru-cached-getter/blob/master/CHANGELOG.md).


