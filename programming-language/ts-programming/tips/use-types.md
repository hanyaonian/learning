# Use Types tips

## Use Types in javascript code

```ts
/**
 * using types in js
 *
 * @see https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html
 *
 * example below
 */

/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  // got eslint type hint here
};

/** @type {number | undefined} */
let a;

/** @type {{a: number}} */
var obj = { a: 1 };

/**
 * @param {string} [name] - Somebody's name.
 */
const sayHi = (name) => console.log(`hi ${name}`);
/**
 * what you got in type hint:
 * const sayHi: (name: any) => void
 * @param name — Somebody's name.
 * /
```

## triple-slash-directives

- Docs: https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html

```ts
// you dont need to 'npm insatll @types/node'
// simple use triple-slash-directives on top:

/// <reference types="node" />

// now you get nodejs types hint
```

similarly

```ts
/// <reference types="vite/client" />

// you got import.meta.MODE ... etc.
```

## Use Types with javascript files

for example we have a javascript file like `index.js`.

```js
export function hello(name) {
  return "hi" + name;
}
```

If we want to use typescript hint, creating a `index.d.ts` would help;

```ts
// index.d.js
export declare function hello(name: string): string;

// other.js
// get hint in ide:
// (alias) function hello(name: string): string
import { hello } from "index.js";
```
