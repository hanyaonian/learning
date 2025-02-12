# 常见的请求控制手段

## debounce in javascript 防抖

- 经典场景: 搜索连续键入

debounce: 同一时间段内的多个操作，只执行最后一个;

```ts
function debounce(fn: (...args: any) => any, time = 500) {
  let timer: undefined | number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
}
```

## throttle in javascript 节流

throttle: 节流 (throttle) 指的是，在一段时间内只会执行一次触发事件的回调 (callback) 函式，若在这之中又有新事件触发，则不执行此回调函式。

- 经典场景: 滚动过程中执行某些操作

```ts
function throttle(fn: (...args: any) => any, time = 500) {
  let lastCallTime = 0;
  let timer: number | null = null;

  return function (...args: any[]) {
    const now = Date.now();
    if (now - lastCallTime >= wait) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else if (timer === null) {
      timer = window.setTimeout(() => {
        lastCallTime = Date.now();
        fn.apply(this, args);
        timer = null;
      }, wait - (now - lastCallTime));
    }
  };
}
```

## Abort

关联概念: Abortcontroller. 可参考[此处介绍](./abortcontroller/abort.md).

参考:

- https://axios-http.com/docs/cancellation

场景:

- 搜索连续输入, 前一次请求也许会覆盖后一次的; 一般还需要结合 debounce
