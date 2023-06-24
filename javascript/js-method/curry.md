## 函数科里化的实现与应用

### 函数柯里化简介

柯里化是转换函数的方法，将 func(a,b,c) 转换为可以被 f(a)(b)(c) 的调用方式。
看起来很简单也很好实现，但是作用在哪呢（好的，日常工作也确实没怎么用到）？

### 柯里化作用在哪？

在一些场景里可以简化参数量（这么描述应该还是准确的）：
例如使用 fetchApi 时，通常的场景是

```js
function getData(url, method, data) {
  return fetch(url, {
    body: data,
    method: method
    // ...
  });
}
// 假如将请求方法 getData 柯里化之后，可以这样创造出参数更明确（关注点从参数转移到方法上）的方法供调用：
// 与a端接口交互的页面
const curriedGetData = curry(getData);
getDataBypost = curriedGetData('https://www.a.com/api', 'post');
//const getDataFromAsite = curriedGetData('https://www.a.com/api'); //或者这样，再创建出post、get两个版本
const someData = await getDataBypost(data);
// 原本可能是: const someData = getData('https://www.a.com/api', 'post', data), 三个参数变成了一个
// etc...
```

再例如使用 日志中间件 时，场景可能是

```js
logFunc('info', 'moduleA', 'normal day' + new Date().getTIme());
logFunc('warning', 'moduleA', 'bad request' + new Date().getTIme());
// 柯里化之后，日志可以更加明确单个模块的日志方法：
// 这样你就只需要关心调用哪个方法，输入什么信息，而不需要调用的时候关心三个参数都是什么了
const aInfoLog = curriedLogFunc('info')('moduleA');
const aWarningLog = curriedLogFunc('warning')('moduleA');
if (normal) {
  aInfoLog('normal day...');
}
```

### 代码实现：

见注释：

```js
function curry(fn) {
  // 具名是因为要给后续参数不足的场景重新调用
  return function subCurried(...args) {
    if (args.length >= fn.length) {
      // 参数符合调用条件，直接调用
      return fn.apply(this, args);
    } else {
      // 返回一个function，可以接着调用
      return function (...args2) {
        // 拼接参数
        return subCurried.apply(this, args.concat(args2));
      };
    }
  };
}

// test cases
function add(a, b) {
  return a + b;
}

let curriedAdd = curry(add);
let preAddOne = curriedAdd(1);
console.log(curriedAdd(1, 2));
console.log(curriedAdd(1)(2));
console.log(preAddOne(2));
// all 3
```

### 这样面试问到柯里化，小伙伴们也不用担心啥也写不出来啦！
