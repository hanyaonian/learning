# Use Types tips

## Use Types in javascript

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
  // got type hint here
};
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
