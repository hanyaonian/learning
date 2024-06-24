### 实现一些原型函数的 polyfill

数组是 Array 的实例，因此在 prototype 中 this 指向的是数组本身。了解这个概念写出后续的方法很简单，知道参数就可以了。

- Array.prototype.map

```js
Array.prototype.myMap = function (callback, context) {
  const returnArr = [];
  for (let i = 0; i < this.length; i++) {
    // map(callback(element[, index[, array]])[, thisArg])
    returnArr.push(callback.call(context || null, this[i], i, this));
  }
  return returnArr;
};

// test
console.log(
  [1, 2, 3].myMap((val, i, arr) => {
    return {
      val: val * 2,
      index: i,
      arr
    };
  })
);
/**
0: {val: 2, index: 0, arr: Array(3)}
1: {val: 4, index: 1, arr: Array(3)}
2: {val: 6, index: 2, arr: Array(3)}
 * /
```

- Array.prototype.filter

```js
Array.prototype.myFilter = function (callback, context) {
  const returnArr = [];
  for (let i = 0; i < this.length; i++) {
    // filter(callback(element[, index[, array]])[, thisArg])
    const result = Boolean(callback.call(context || null, this[i], i, this));
    if (result) {
      returnArr.push(this[i]);
    }
  }
  return returnArr;
};

// test
console.log(
  [1, 2, 3, 4, 5, 6, 7].myFilter((val, i, arr) => val <= 2 || i >= 6)
);
// [1, 2, 7]
```
