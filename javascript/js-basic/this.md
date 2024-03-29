# this

## 箭头函数 this 指向

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

## examples

### promisify

```js
function promisify(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
      fn.apply(
        this,
        [].concat(args).concat([
          (err, res) => {
            if (err != null) {
              return reject(err);
            }
            resolve(res);
          }
        ])
      );
    });
  };
}
```

why fn.apply? -> this 指向问题;
or fn.call ?

// 参考 javascript\js-method\functionBasic.md
