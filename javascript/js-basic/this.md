### 剪头函数 this 指向

```js
const home = {
  a: {
    num: 1,
    func: () => {
      console.log(this, this.num);
    }
  },
  num: 10
};

home.a.func(); // result ?
```

照正常理解，browser 下应该是 window，node 环境下是 global.
实际上写入文件并通过 node 执行时，输出的是 module.export. (外面的 this 就指向上下文 node 里的上下文是 module.export)
