# Functional Programming

## 基本概念

- 函数是可以作为参数、变量的
- 声明式编程 [参考 sql, 各种 dsl 等]
- 惰性执行
- 无状态与数据不可变
- 无副作用
- 纯函数

### 纯函数

- No side effect 无副作用
- 同输入输出永远一致
- 不依赖外部状态

下方示例：非纯函数, Date、console 一个可变，另一个是依赖系统

```ts
function log(text: string) {
  console.log(`[${new Date().toLocaleString()}]: ${text}`);
}
```

如何改使其成为无副作用的纯函数？

```ts
// 去外部依赖
function log(text: string, date: string, logger: IConsole) {
  logger.log(`[${date}]: ${text}`);
}

// 隔离
function log(text: string) {
  return () => {
    console.log(`[${new Date().toLocaleString()}]: ${text}`);
  };
}
```

## 实践

参考 `fp-ts` 之类的框架;

使用 curry, pipe, compose 等方法排列组合函数, 完成任务.

## 参考

- https://juejin.cn/post/6844903936378273799
