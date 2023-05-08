# debounce in javascript

```ts
function debounce(fn: Function, time = 500) {
  let timer: undefined | number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
}

```
