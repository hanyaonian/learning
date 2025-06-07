# Private member initialization

见: `./private-member.ts`, 可以理解执行顺序;

`private name = "initial name"` 等价于

```ts
constructor () {
  // ... 执行前边其他逻辑

  // 最后末尾
  this.name = "initial name";
}
```
