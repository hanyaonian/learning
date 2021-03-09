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

  public static resolve(value): myPromise {
    // 能简单返回一个resolve的promise吗？参考MDN：
    //1. 如果这个值是一个 promise ，那么将返回这个 promise ；
    //1. en: If the value is a promise, that promise is returned;
    //2. 如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
    //3. 否则返回的promise将以此值完成。(静态值)
    // 此函数将类promise对象的多层嵌套展平。
    // 已有promise resolve procedure, 无需多与操作
    return new myPromise((resolve, reject) => {
      resolve(value);
    });
  }

  public static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason);
    });
  }

  public static all(promiseArr: any[]): myPromise {
    let promise2 = new myPromise((resolve, reject) => {
      const ansArr: any[] = [];
      const len = promiseArr.length;
      let current = 0;
      promiseArr.forEach((singlePromise, index) => {
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
}
