# Type practice

## get return type of a promise-based function

```ts
export type ResAwaitedType<T extends (...args: any) => any> = ReturnType<T> extends Promise<infer U> ? U : never;
```

explain:

1. `T extends (...args: any) =>` 限制类型为函数
2. `ReturnType<T> extends Promise<infer U> ? U : never;` 如果ReturnType是promise, 那么返回U (分支条件), 否则无效推导;