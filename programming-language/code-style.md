# Code style guide

[Reference: Goolge TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

## Setting up

- Use [`gts`](https://github.com/google/gts)

## specific rules I do not know before

### Modules import/export

- case 1

```ts
// Bad: overlong import statement of needlessly namespaced names.
import {Item as TableviewItem, Header as TableviewHeader, Row as TableviewRow,
  Model as TableviewModel, Renderer as TableviewRenderer} from './tableview';

// Better: use the module for namespacing.
import * as tableview from './tableview';
```

- case 2

```ts
// Bad: The module name does not improve readability.
import * as testing from './testing';

testing.describe('foo', () => {
  testing.it('bar', () => {
    testing.expect(null).toBeNull();
    testing.expect(undefined).toBeUndefined();
  });
});
```

```ts
// Better: give local names for these common functions.
import {describe, it, expect} from './testing';

describe('foo', () => {
  it('bar', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});
```

### Language features

#### Array

- use `Array.from()` or bracket notation instead of `Array` constructor;

#### This

- rebinding `this`

```ts
function clickHandler() {
  // Bad: what's `this` in this context?
  this.textContent = 'Hello';
}
// Bad: the `this` pointer reference is implicitly set to document.body.
document.body.onclick = clickHandler;
```

```ts
// Good: explicitly reference the object from an arrow function.
document.body.onclick = () => { document.body.textContent = 'hello'; };
// Alternatively: take an explicit parameter
const setTextFn = (e: HTMLElement) => { e.textContent = 'hello'; };
document.body.onclick = setTextFn.bind(null, document.body);
```

case [arrow function as properties](https://google.github.io/styleguide/tsguide.html#arrow-functions-as-properties)

#### Error handling

- throw error 1

```ts
// Always use new Error()
throw new Error('Foo is not a valid bar.');
```

- throw error 2

```ts
// Throw only Errors
throw new Error('oh noes!');
// ... or subtypes of Error.
class MyError extends Error {}
throw new MyError('my oh noes!');
// For promises
new Promise((resolve) => resolve()); // No reject is OK.
new Promise((resolve, reject) => reject(new Error('oh noes!')));
Promise.reject(new Error('oh noes!'));
```

- throw error 3

```ts
// code should assume that all thrown errors are instances of Error.
function assertIsError(e: unknown): asserts e is Error {
  if (!(e instanceof Error)) throw new Error("e is not an Error");
}

try {
  doSomething();
} catch (e: unknown) {
  // All thrown errors must be Error subtypes. Do not handle
  // other possible values unless you know they are thrown.
  assertIsError(e);
  displayError(e.message);
  // or rethrow:
  throw e;
}
```

#### Type assertion

- Use type annotations (: Foo) instead of type assertions (as Foo) to specify the type of an object literal.

#### Code block

- Limit the amount of code inside a try block, if this can be done without hurting readability.

```ts
// BAD
try {
  const result = methodThatMayThrow();
  use(result);
} catch (error: unknown) {
  // ...
}
```

```ts
// GOOD
let result;
try {
  result = methodThatMayThrow();
} catch (error: unknown) {
  // ...
}
use(result);
```

### Naming

#### Naming style

- Do not use trailing or leading underscores for private properties or methods.
- Do not use the opt_ prefix for optional parameters.
- Do not mark interfaces specially (suchas IMyInterface or MyFooInterface) unless it's idiomatic in its environment. When introducing an interface for a class, give it a name that expresses why the interface exists in the first place (e.g. class TodoItem and interface TodoItemStorage if the interface expresses the format used for storage/serialization in JSON).

#### Rules

- Common Case

| Style          | Category                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| UpperCamelCase | class / interface / type / enum / decorator / type parameters / component functions in TSX / JSXElement type parameter |
| lowerCamelCase | variable / parameter / function / method / property / module alias                                                     |
| CONSTANT_CASE  | global constant values, including enum values.                                                                         |
| #ident         | private identifiers are never used.                                                                                    |

- Prefix

`_` must not be used as an identifier by itself (e.g. to indicate a parameter is unused).

```ts
const [a, , b] = [1, 5, 10];  // a <- 1, b <- 10
```

- File

use `kebab-case`

- Type parameters

Type parameters, like in Array<T>, may use a single upper case character (T) or UpperCamelCase.

- Test Case 

Test method names inxUnit-style test frameworks may be structured with _ separators, e.g. `testX_whenY_doesZ()`.


### TODO: 6 Type system