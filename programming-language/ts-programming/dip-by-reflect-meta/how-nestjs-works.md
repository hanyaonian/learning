# How Nestjs di works

Nestjs 和 Angular 有一些设计比较有意思：通过装饰器（Decorators）做到依赖注入；Nestjs 直说了自己参考的 angular 的, 这部分感兴趣的可以去看看官方文档：

- Nestjs 官网文档: https://docs.nestjs.com/
- Angular 文档说明 DI 的逻辑: https://angular.io/guide/dependency-injection

## Nestjs 官方示例: 了解使用

路由的注册与控制器的编写十分容易去写, 以下是一个简单的示例：

```ts
import { Controller, Get, Post } from "@nestjs/common";

@Controller("cats")
export class CatsController {
  @Post()
  create(): string {
    return "This action adds a new cat";
  }

  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

控制器已经准备就绪, 可以使用, 但是 Nest 依然不知道 CatsController 是否存在, 所以它不会创建这个类的一个实例。

使用 `@Module()` 装饰器将元数据附加到模块类中, 现在, Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装。

```ts
// in app.module.ts
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

Provider 提供器是 Nest 中的一个基本概念。许多基本的 Nest 类可以被视为提供器 - 服务、存储库、工厂、助手等等。提供器的主要思想是它可以作为依赖注入；这意味着对象之间可以创建各种关系, 并且 "接线" 这些对象的功能很大程度上可以委托给 Nest 运行时系统。

![Provider](/assets/programming-language/nestjs-design/provider.png)

```ts
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

现在我们有了一个检索猫的服务类, 让我们在 `CatsController` 中使用它, `CatsService` 通过类构造函数注入。请注意 private 语法的使用。这种简写允许我们立即在同一位置声明和初始化 catsService 成员。

```ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

现在我们已经定义了一个提供器 (CatsService), 并且我们有了该服务的一个消费者 (CatsController), 我们需要向 Nest 注册该服务以便注入。

```ts
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

完成了 controller 和 provider 后, 启动应用, http://localhost:3000/cats 可以正确识别请求并且给出对应的回应.

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(async function () {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
})();
```

接下来引出我们的问题：

## DI 是怎么做到的？如何通过 反射（reflect）得知都有什么控制器/服务？

在 Nest 中, 由于 TypeScript 的功能, 管理依赖非常容易, 因为它们只是按类型解析。

```ts
constructor(private catsService: CatsService) {}
```

But How?

如何做到的? Nest.js 是如何知道 controller 需要哪些 provider 的呢？

详见 示例代码 `./sample` 下的内容, 下面简单描述一下:

### 结合示例与装饰器（Decorators）的功能来看

装饰器设计模式在 `design-pattern-in-js/structural/decorator/decorator.md`, 可以看到具体说明。

TS 中的 常规 装饰器（Decorators）简单说明:

- 类装饰器应用于类声明, 可以用来监视、修改或替换类定义。
- 方法装饰器应用于类的方法, 可以用来监视、修改或替换方法定义。
- 属性装饰器应用于类的属性, 可以用来监视或修改属性的定义。
- 参数装饰器应用于方法参数, 可以用来监视或修改参数的定义。

示例中出现的装饰器有：

- Module: `类装饰器`
- Controller: `类装饰器`
- Injectable: `类装饰器`
- Get/Post: `方法装饰器`

看起来不足以完成这个功能啊。这个时候就要说另一个东西, metadata 元数据。

#### 介绍：反射机制、注解、元数据

- 反射机制（Reflection）

  反射是一种编程技术, 它允许程序在运行时检查、修改和操作对象的结构。反射机制的一个典型应用场景是在运行时检查对象的类型、属性和方法, 或者动态地创建和修改对象。

- 注解（Annotations）

  注解是一种用于为代码添加额外信息的标记。在 TypeScript 中, 注解通常以装饰器(Decorators)的形式出现。装饰器是一种特殊类型的声明, 可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 @expression 的形式, 其中 expression 必须是一个函数, 该函数将在运行时被调用, 并带有关于被装饰的声明的信息.

- 元数据（Metadata）

  元数据是与程序元素（如类、方法、属性等）相关联的数据, 它提供了关于这些元素的额外信息。在 TypeScript 中, 元数据通常以键值对的形式存在, 可以通过反射机制在运行时访问和操作。

#### Typescript 语言特性: 元数据

TypeScript 支持使用 [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) 库来添加和读取元数据。可以使用装饰器将元数据附加到类、方法或属性上, 然后在运行时使用反射 API 获取这些元数据。通过元数据反射, 可以获取到方法的参数类型、返回类型等(包含构造函数)

这个需要打开 ts 配置中的 `emitDecoratorMetadata`, 在这里可以看到具体的说明: https://www.typescriptlang.org/tsconfig/#Language_and_Environment_6254。我们用最小实例来看看开启前后的作用:

```ts
import "reflect-metadata";

// 空装饰器, 啥也没做
const Injectable = (): ClassDecorator => {
  return () => {};
};

@Injectable()
class HelloService {
  constructor(number: Number, string: String) {
    console.log("hello service");
  }
}
```

产出的代码很多, 这里节选:

```js
var HelloService = /** @class */ (function () {
  function HelloService(number, string) {
    console.log("hello service");
  }
  HelloService = __decorate(
    [Injectable(), __metadata("design:paramtypes", [Number, String])],
    HelloService
  );
  return HelloService;
})();
```

可以看到, 用到了装饰器 + `emitDecoratorMetadata`, 会多出一个 `design:paramtypes` 用来记录构造函数的参数类型。这就是为啥 nestjs 可以做到依赖注入并准确的将需要的类型插入到控制器构造函数中。emitDecoratorMetadata 支持的几种特定的 key 如下:

- design:paramtypes 获取函数参数类型
- design:type 获取类型
- design:returntype 获取返回值类型

## 动手复刻一个相似的 DI: 加深理解

我们希望达成的目标, 是做到最低限度的复刻, 长得像就行了:

```ts
@Injectable()
class HelloService {
  constructor() {
    console.log("hello service created");
  }
  sayHi() {
    return "hello world";
  }
}

@Controller("/test")
class HelloController {
  constructor(private hello_service: HelloService) {
    console.log("hello controller created");
  }

  @Get("/get_hello")
  someGetMethod() {
    const result = this.hello_service.sayHi();
    console.log(`result from hello service: ${result}`);
    return result;
  }

  @Post("/post_hello")
  somePostMethod() {
    const result = this.hello_service.sayHi();
    console.log(`${result} post to hello service.`);
    return `post ${result} success`;
  }
}

@Module({
  [METADATA_KEYES.Controller]: [HelloController],
  [METADATA_KEYES.Providers]: [HelloService],
})
class Application {}

const server = createServer(Application);

// mock post & get request
```

这个就是一个比较轻量的实践, 假如说调用 `/test/get_hello`能拿到 `hello world`, 那么就说明代码注入也完成了！

这下我们用 `"design:paramtypes"` 去做这个依赖注入:

```ts
// 通过反射将 Injectable 的 providers 收集起来;
const Injectable = (): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEYES.Providers, {}, target);
  };
};

// 诸如此类, controller & module & get/post 均做元数据记录;

type Constructor<T = any> = new (...args: any[]) => T;

// 依赖注入
const inject = (target: Constructor<any>, providers: Constructor<any>[]) => {
  const deps = [...(Reflect.getMetadata("design:paramtypes", target) || [])];
  const args = deps.map((dep: Constructor) => {
    const target_provider = providers.find((provider) => {
      return dep === provider || dep instanceof provider;
    });
    if (!target_provider) {
      // Ahh, Module 里未提供该 provider
    }
    return new target_provider();
  });
  return new target(...args);
};

const createServer = (instance) => {
  // ...
  const controllersClasses = Reflect.getOwnMetadata(
    METADATA_KEYES.Controller,
    instance
  );
  const providersClasses = Reflect.getOwnMetadata(
    METADATA_KEYES.Providers,
    instance
  );
  const controllers = controllersClasses.map((controller) =>
    inject(controller, providersClasses)
  );
  // ...
};

// 测试代码...
```

成功拿到正确的类型并且注入了数据！完整代码见 `./sample/sample.ts`

### 坑

1. reflect-metadata 存在一些问题

- To enable experimental support for auto-generated type metadata in your TypeScript project, you must add "emitDecoratorMetadata": true to your tsconfig.json file.
  - Please note that auto-generated type metadata may have issues with circular or forward references for types.

### 最新更新

2024-07 之后, rollup, esbuild 等主流的工具都支持了 5.0 的装饰器，现在可以说非常好使用了 0.0
