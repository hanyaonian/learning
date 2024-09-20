# Decorator 装饰器模式

装饰器可以在不破坏原有代码的情况下去给对象新增新的功能，帮助提高代码复用性.

举个例子，我想给各个逻辑统计一下执行耗时，如果直接更改代码，那可能是

```ts
class Logic {
  handle() {
    // 开始
    let now = new Date().getTime();
    console.log("start", now);
    // logic...
    // 结束
    console.log("end", new Date().getTime() - now);
  }
}
```

可以看到，原逻辑的前后都会变更代码，代码逻辑也会更冗余复杂.

装饰器模式，便是处理这种问题的一个方法, 可以减少重复代码的编写, 也不去增加复杂度.

```ts
class LogicDecorator {
  constructor(logic) {
    this.logic = logic;
  }

  handle() {
    // 开始
    let now = new Date().getTime();
    console.log("start", now);
    // 原逻辑没有遭到破坏
    this.logic.handle();
    // 结束
    console.log("end", new Date().getTime() - now);
  }
}
```

当然，在语法上有更轻松的写法:

```ts
class Logic {
  @counttime()
  handle() {
    // logic...
  }
}
```

这里的 counttime 就是一些编程语言中的修饰器语法。

## TypeScript 中的应用

参考:
[typescript5.0 decorator](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)
[typescript experimental decorator](https://www.typescriptlang.org/docs/handbook/decorators.html)

两种有些差异. 需要做出一些适应.

实操:
[logger](https://github.com/hanyaonian/m-logger)

实践理解:
[how-nestjs-works](/programming-language/ts-programming/dip-by-reflect-meta/how-nestjs-works.md)
