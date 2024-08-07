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

一种适配器模式的应用。

### Case

![DIP](/assets/software-design/dip-case.png)

图 1 中，高层对象 A 依赖于底层对象 B 的实现；图 2 中，把高层对象 A 对底层对象的需求抽象为一个接口 A，底层对象 B 实现了接口 A，这就是依赖反转。

### Good

- 减少类之间的耦合性，提高系统的稳定性。（根据类与类之间的耦合度从弱到强排列：依赖关系、关联关系、聚合关系、组合关系、泛化关系和实现关系）
- 降低并行开发引起的风险（两个类之间有依赖关系，只有指定两者之间的接口（或抽象类）就可以独立开发了）
- 提高代码的可读性和可维护性

### Reference

- https://juejin.cn/post/7187045476049846327
