# SOLID in software design

SOLID（单一功能、开闭原则、里氏替换、接口隔离以及依赖反转）

## S - Single responsibility principle

## O - Open-close principle

## L - Liskov substitution principle

## I - Interface segregation principle

## D - Dependency inversion principle

- 高层模块不依赖底层模块，它们共同依赖同一个抽象。
- 抽象不要依赖具体实现细节，具体实现细节依赖抽象。

### Description

一种适配器模式的应用。目的是为了解开耦合。

### Common

| 维度         | 传统依赖方式                     | 应用依赖倒置后               |
| :----------- | :------------------------------- | :--------------------------- |
| **依赖方向** | 高层模块直接依赖低层模块         | 高层和低层模块都依赖抽象接口 |
| **耦合度**   | 紧耦合，改动低层模块可能影响高层 | 松耦合，低层模块可独立替换   |
| **核心关系** | 细节决定抽象                     | 抽象决定细节                 |
| **灵活性**   | 低，修改和扩展成本高             | 高，易于扩展和测试           |

![DIP](/assets/software-design/dip-case.png)

图 1 中，高层对象 A 依赖于底层对象 B 的实现；图 2 中，把高层对象 A 对底层对象的需求抽象为一个接口 A，底层对象 B 实现了接口 A，这就是依赖反转。

### Case

给出一个更具体的示例: 数据上传到云存储.

按照非 DIP 的写法, 直接依赖具体实现, 代码可能如下:

```ts
// 底层模块: 基础上传组件
// AliYun sdk, etc
import TencentCloudSdk from "tencent-cloud";

class TUploadService {
  constructor(config) {
    // ...
  }
  async uploadFile(params) {
    // ... logic with tencent cloud
  }
}

// 高层模块: 业务逻辑
class FileHandler {
  // ...
  service: TUploadService;
  upload() {
    this.service.uploadFile(params);
  }
}
```

这会导致一个什么问题? 高层模块（如组件或服务）直接实例化或引入了具体的低层模块，这会导致整个系统强耦合于底层模块（腾讯云）。假如这个时候，我们要切换云存储，那是所有的低端代码会即刻不可用，需要完全重写。同时，这个还会是难以测试的，因为这将存在真实的网络请求(腾讯云 SDK).

遵循 DIP 的原则，上述的代码可以被改写为这样的设计：

```ts
// DIP 抽象层
abstract class UploadService {
  constructor(config) {
    // ...
  }

  // 细节未定义
  abstract async uploadFile(params): Promise<Result>;
}

// 底层实现: 可以是 Aliyun、别的云等等...
class TUploadService {
  async uploadFile(params): Promise<Result> {
    // Tcloud detail
  }
}

class MockUploadService {
  async uploadFile(params): Promise<Result> {
    // Mock / Unit test
  }
}

// 业务层具体实现
class FileHandler {
  // 可拓展，与底层细节无耦合
  service: UploadService;
  upload() {
    this.service.uploadFile(params);
  }
}
```

### Good

- 减少类之间的耦合性，提高系统的稳定性。（根据类与类之间的耦合度从弱到强排列：依赖关系、关联关系、聚合关系、组合关系、泛化关系和实现关系）
- 降低并行开发引起的风险（两个类之间有依赖关系，只有指定两者之间的接口（或抽象类）就可以独立开发了）
- 提高代码的可读性和可维护性

### Reference

- https://juejin.cn/post/7187045476049846327
