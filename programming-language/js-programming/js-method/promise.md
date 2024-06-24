# Build a promise yourself

[源码地址](https://github.com/hanyaonian/web-dev-learning/tree/main/js-method/myPromise)

要实现 Promise，首先要对 Promise 有所了解，并知其标准。

## Promise 简介([MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise))

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

一个 Promise 必然处于以下几种状态之一：

待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
已兑现（fulfilled）: 意味着操作成功完成。
已拒绝（rejected）: 意味着操作失败。
待定状态的 Promise 对象要么会通过一个值被兑现（fulfilled），要么会通过一个原因（错误）被拒绝（rejected）。当这些情况之一发生时，我们用 promise 的 then 方法排列起来的相关处理程序就会被调用。如果 promise 在一个相应的处理程序被绑定时就已经被兑现或被拒绝了，那么这个处理程序就会被调用，因此在完成异步操作和绑定处理方法之间不会存在竞争状态。

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回的是 promise， 所以它们可以被链式调用。

做前端的小伙伴应该都对这个很熟悉了，下面看看如何去实现一个自己的 Promise ～首先看看 Promise 规范!（当看需求…(o^^o)）

## [Promise aplus 规范](https://promisesaplus.com/)

以下翻译了部分规范，方便小伙伴们提前了解代码注释内容。

### 关键词

- "promise"是具有 then 方法的对象或函数，其行为符合此规范。
- "thenable"是定义 then 方法的对象或函数。
- "value"是任意合法的 Javascript 值，（包括 undefined,thenable, promise），终值
- "exception"是使用 throw 语句抛出的值，异常
- "reason"是表示 promise 为什么被 rejected 的值，拒因

#### 2.1，状态

一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。

- Pending: 可以迁移至执行态或拒绝态
- Fulfilled: 必须拥有一个不可变的终值; 状态不可变
- Rejected: 必须拥有一个不可变的据因; 状态不可变

### 2.2 节选，then 部分

- 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
- promise 的 then 方法接受两个参数（都是可选的）: promise.then(onFulfilled, onRejected), 两个参数是得是函数，如果不是，就忽略掉。
  1. onFulfilled, 第一个参数为 promise 的终值 value
  2. onRejected, 第一个参数为 promise 的拒因 reason
- （2.2.4）在执行上下文堆栈（execution context）仅包含平台代码之前，不得调用 onFulfilled 和 onRejected 3.1
  - 其实这点想想很清楚的， then 是微任务，只有任务队列里没事了才会走，但因为当时头昏没有看懂这句话什么意思，错误的在将回调函数入栈的时候加了个 settimeout，一直写不对，看了很久没看出原因。
- then 必须返回一个 promise 对象，即是：

  ```javascript
  promise2 = promise1.then(onFulfilled, onRejected);
  ```

  - 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
  - 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
  - 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
  - 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因

### 2.3 Promise 解决过程，resolve promise procedure, 即 2.2 里[[Resolve]](promise2, x)过程

这个部分基本就是照着规范来写即可，具体规范写在代码备注里。

### 备注

指的是引擎，环境和 promise 执行代码。在实践中，此要求确保 onFulfilled 和 onRejected
能够异步执行，在 then 被调用之后传入事件环，并使用新的栈。这可以使用诸如 setTimeout 或 setImmediate 之类的“宏任务”机制，
或者使用诸如 MutationObserver 或 process.nextTick 之类的“微任务”机制来实现。
由于 promise 实现被认为是平台代码，因此它本身可能包含一个任务调度队列或调用处理程序的“trampoline”。
此处参考了一篇博文的翻译:[非常兔翻译](https://juejin.cn/post/6844903649852784647)

完整代码如下：
建议阅读顺序， 思路和注释是跟着 Aplus 标准走的：

- constructor
- then
- promiseResolutionProcedure
- resolve
- all

```typescript
export enum promiseStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled'
}

export type promiseExecutor = (resolve: Function, reject: Function) => void;
type callbackVoidFunction = () => void;

// 链式调用问题处理，2.3部分，先看下面2.2的基础实现。
function promiseResolutionProcedure(
  promise2: myPromise,
  x: any,
  resolve,
  reject
) {
  if (promise2 === x) {
    reject(new TypeError('same promise here'));
  }
  // 2.3.2 返回promise
  if (x instanceof myPromise) {
    if (x.status === promiseStatus.PENDING) {
      // 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
      x.then(
        (value) => {
          promiseResolutionProcedure(promise2, value, resolve, reject);
        },
        (reason) => {
          reject(reason);
        }
      );
    } else {
      // 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
      // 2.3.2.3 If/when x is rejected, reject promise with the same reason.
      x.then(resolve, reject);
    }
    return;
  }
  // 2.3.3 x 是对象或者函数
  // 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
  let isCalled = false;
  // typeof null 是object
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      // 2.3.3.1 Let then be x.then.
      let then = x.then as Function;
      // 2.3.3.3
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            // 2.3.3.3.3 If both resolvePromise and rejectPromise are called,
            // or multiple calls to the same argument are made,
            // the first call takes precedence, and any further calls are ignored.
            if (isCalled === false) {
              isCalled = true;
              // 2.3.3.3.1
              promiseResolutionProcedure(promise2, y, resolve, reject);
            }
          },
          (reason) => {
            // 2.3.3.3.3
            if (isCalled === false) {
              isCalled = true;
              // 2.3.3.3.2
              reject(reason);
            }
          }
        );
        //2.3.3.3.4 If calling then throws an exception e
      } else {
        // 2.3.3.4 If then is not a function, fulfill promise with x.
        resolve(x);
      }
    } catch (err) {
      if (isCalled === false) {
        isCalled = true;
        // 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
        reject(err);
      }
    }
  } else {
    //2.3.4 If x is not an object or function, fulfill promise with x.
    resolve(x);
  }
}

export default class myPromise {
  status: promiseStatus;
  reason: any;
  value: any;
  resolveStack: callbackVoidFunction[];
  rejectStack: callbackVoidFunction[];

  constructor(executor: promiseExecutor) {
    this.status = promiseStatus.PENDING;
    this.reason = null;
    this.value = null;
    // 存储promise 链式调用结果
    this.resolveStack = [];
    this.rejectStack = [];

    const resolve = (value: any) => {
      // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
      setTimeout(() => {
        if (this.status === promiseStatus.PENDING) {
          this.value = value;
          this.status = promiseStatus.FULFILLED;
          for (let i = 0; i < this.resolveStack.length; i++) {
            this.resolveStack[i]();
          }
        }
      });
    };

    const reject = (reason: any) => {
      // 2.2.4
      setTimeout(() => {
        if (this.status === promiseStatus.PENDING) {
          this.reason = reason;
          this.status = promiseStatus.REJECTED;
          for (let i = 0; i < this.rejectStack.length; i++) {
            this.rejectStack[i]();
          }
        }
      }, 0);
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  public then(onFulfilled, onRejected?): myPromise {
    // 2.2.1 Both onFulfilled and onRejected are optional arguments: if not a function, igonre
    // 2.2.1 解析: 非function的话传入的是一个fulfilled的内容，所以把该值作为一个传递给promise2用来relsove的function

    // 2.2.5 onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]

    // 2.7.2.3 If onFulfilled is not a function and promise1 is fulfilled,
    // promise2 must be fulfilled with the same value as promise1.
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    onRejected =
      // 2.7.2.4 If onRejected is not a function and promise1 is rejected,
      // promise2 must be rejected with the same reason as promise1.
      // 这里的err是promise1 的reject原因，throw 出去promise2 就可以catch到
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };
    // 2.2.7 then must return a promise
    let promise2 = new myPromise((resolve, reject) => {
      if (this.status === promiseStatus.FULFILLED) {
        // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code
        // 下面的settimeout同理
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // 调用promiseResolutionProcedure 2.2.7.1 规则
            // 2.2.7.1  If either onFulfilled or onRejected returns a value x,
            //run the Promise Resolution Procedure[[Resolve]](promise2, x).
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (this.status === promiseStatus.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            // 2.2.7.2 If either onFulfilled or onRejected throws an exception e,
            // promise2 must be rejected with e as the reason.
            // 下面同理
            reject(err);
          }
        });
      }
      // 存储顺序，执行到resolve，reject的时候会调用顺序栈里的结果
      // 这里用的设计模式是订阅，stack里存的是订阅者，调用resolve属于发布
      if (this.status === promiseStatus.PENDING) {
        // 2.2.6.1 If/when promise is fulfilled,
        // all respective onFulfilled callbacks must execute in the order of their originating calls to then.
        this.resolveStack.push(() => {
          try {
            let x = onFulfilled(this.value);
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        // 2.2.6.2
        this.rejectStack.push(() => {
          try {
            let x = onRejected(this.reason);
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
    });
    // 2.2.7 用于链式调用
    return promise2;
  }

  public static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

### 静态方法： Promise.resolve 实现

见注释。

```typescript
public static resolve(value): myPromise {
  // 能简单返回一个resolve的promise吗？参考MDN：
  //1. 如果这个值是一个 promise ，那么将返回这个 promise ；
  //1. en: If the value is a promise, that promise is returned;
  //2. 如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
  //3. 否则返回的promise将以此值完成。(静态值)
  // 此函数将类promise对象的多层嵌套展平。
  return new myPromise((resolve, reject) => {
    resolve(value);
  });
}
```

### 静态方法：Promise.all 实现

Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型）的输入，并且只返回一个 Promise 实例， 那个输入的所有 promise 的 resolve 回调的结果是一个数组。这个 Promise 的 resolve 回调执行是在所有输入的 promise 的 resolve 回调都结束，或者输入的 iterable 里没有 promise 了的时候。它的 reject 回调执行是，只要任何一个输入的 promise 的 reject 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。

```typescript
  public static all(promiseArr: any[]): myPromise {
    let promise2 = new myPromise((resolve, reject) => {
      const ansArr: any[] = [];
      const len = promiseArr.length;
      let current = 0;
      // 注意，要支持iterable形式，所以上面的any[]类型是不准确的,应该是 iterable<any>
      // 循环 for...of...更合适，并且记录iterable数。
      // 但是为了方便，就先这么写吧
      promiseArr.forEach((singlePromise, index) => {
        // promise类型处理
        if (singlePromise instanceof myPromise) {
          singlePromise.then(
            (val) => {
              ansArr[index] = val;
              current += 1;
              // 全部完成，all返回数组
              if (current === len) {
                let x = resolve(ansArr);
                // all 也是thenable的
                promiseResolutionProcedure(promise2, x, resolve, reject);
              }
            },
            // 有一个失败 all就返回异常
            (reason) => {
              reject(reason);
            }
          );
        } else {
          // 非Promise类型值的处理
          ansArr[index] = singlePromise;
          current += 1;
          if (current === len) {
            let x = resolve(ansArr);
            // all 也是thenable的
            promiseResolutionProcedure(promise2, x, resolve, reject);
          }
        }
      });
    });
    return promise2;
  }
```

### 附上 test case

- Aplus test
  需要先安装 promises-aplus-tests 依赖, tsc 编译后运行或者 ts-node 运行，可以完美通过所有 test cases

```typescript
import myPromise from './index';
import * as promiseTest from 'promises-aplus-tests';

const adapter = {
  deferred: () => {
    let resolve;
    let reject;
    const promise = new myPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      reject,
      resolve
    };
  },
  rejected: (reason) => myPromise.reject(reason),
  resolved: (value) => myPromise.resolve(value)
};

promiseTest(adapter, function (err) {
  // All done; output is in the console. Or check `err` for number of failures.
  console.log(err);
});
```

- Promise resolve test
  这里用的是 MDN 的示范例子

```typescript
import myPromise from './index';

// mdn cases for Promise.resolve
// static resolve
Promise.resolve('Success').then(
  function (value) {
    console.log(value); // "Success"
  },
  function (value) {
    // 不会被调用
  }
);

// reslove a promise
let newPromise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve async promise');
  }, 3000);
});
myPromise.resolve(newPromise).then((data) => {
  console.log(data, 'ok');
});

// resolve thenable and throw error
// Resolve一个thenable对象
var p1 = myPromise.resolve({
  then: function (onFulfill, onReject) {
    onFulfill('fulfilled!');
  }
});
console.log(p1 instanceof myPromise); // true, 这是一个Promise对象

p1.then(
  function (v) {
    console.log(v); // 输出"fulfilled!"
  },
  function (e) {
    // 不会被调用
  }
);

// Thenable在callback之前抛出异常
// Promise rejects
var thenable = {
  then: function (resolve) {
    throw new TypeError('Throwing');
    resolve('Resolving');
  }
};

var p2 = myPromise.resolve(thenable);
p2.then(
  function (v) {
    // 不会被调用
  },
  function (e) {
    console.log(e); // TypeError: Throwing
  }
);

// Thenable在callback之后抛出异常
// Promise resolves
var thenable = {
  then: function (resolve) {
    resolve('Resolving');
    throw new TypeError('Throwing');
  }
};

var p3 = myPromise.resolve(thenable);
p3.then(
  function (v) {
    console.log(v); // 输出"Resolving"
  },
  function (e) {
    // 不会被调用
  }
);
```

```js
//  true
// - Success
// - fulfilled!
// - TypeError: Throwing
// - Resolving
// - resolve async promise ok
```

- Promise all test
  这里用的也是 MDN 的示范例子

```typescript
import myPromise from './index';

// cases for Promise.all
var resolvedPromisesArray = [myPromise.resolve(33), myPromise.resolve(44)];

var p = myPromise.all(resolvedPromisesArray);
// immediately logging the value of p
console.log(p);

// using setTimeout we can execute code after the stack is empty
setTimeout(function () {
  console.log('the stack is now empty');
  console.log(p);
});

// logs, in order:
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }

const promise1 = myPromise.resolve(3);
const promise2 = 42;
const promise3 = new myPromise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

myPromise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});

// expected output: Array [3, 42, "foo"]

var p1 = myPromise.resolve(3);
var p2 = 1337;
var p3 = new myPromise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

myPromise.all([p1, p2, p3]).then((values) => {
  console.log(values); // [3, 1337, "foo"]
});

// finally, expected output:
/**
for Promise:
Promise { <pending> }
the stack is now empty
Promise { [ 33, 44 ] }
[ 3, 42, 'foo' ]
[ 3, 1337, 'foo' ]

for myPromise:
myPromise {
  status: 'pending',
  ...
}
the stack is now empty
myPromise {
  status: 'pending',
  ...
}
[ 3, 42, 'foo' ]
[ 3, 1337, 'foo' ]
 */
```

### 静态方法：Promise.race, Promise.reject
