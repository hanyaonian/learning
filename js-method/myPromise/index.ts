export enum promiseStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled'
}

export type promiseExecutor = (resolve: Function, reject?: Function) => void;
type callbackVoidFunction = () => void;

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
      if (this.status !== promiseStatus.PENDING) {
        return;
      }
      this.value = value;
      this.status = promiseStatus.FULFILLED;
      this.resolveStack.forEach((func) => {
        func();
      });
    };

    const reject = (reason: any) => {
      if (this.status !== promiseStatus.PENDING) {
        return;
      }
      this.reason = reason;
      this.status = promiseStatus.REJECTED;
      this.rejectStack.forEach((func) => {
        func();
      });
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  public then(onFulfilled, onRejected) {
    // 2.2.1 Both onFulfilled and onRejected are optional arguments: if not a function, igonre
    // 2.2.5 onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new myPromise((resolve, reject) => {
      // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code
      // 下面的settimeout同理
      if (this.status === promiseStatus.FULFILLED) {
        // 2.2.7.1 onfufilled 内也返回了值， run the Promise Resolution Procedure
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === promiseStatus.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (err) {
            // 2.2.7.2 If either onFulfilled or onRejected throws an exception e,
            // promise2 must be rejected with e as the reason.
            reject(err);
          }
        }, 0);
      }
      // 存储顺序，执行到resolve，reject的时候会调用顺序栈里的结果
      if (this.status === promiseStatus.PENDING) {
        // 2.2.6.1
        this.resolveStack.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              promiseResolutionProcedure(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
        // 2.2.6.2
        this.rejectStack.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              promiseResolutionProcedure(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
      }
    });
    // 2.2.7 then must return a promise
    // 链式调用
    return promise2;
  }

  public static resolve(value) {
    return new myPromise((resolve) => {
      resolve(value);
    });
  }

  public static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

// 链式调用问题处理，2.3
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
      let then = x.then;
      // 2.3.3.3
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            // 2.3.3.3.3 If both resolvePromise and rejectPromise are called,
            // or multiple calls to the same argument are made,
            // the first call takes precedence, and any further calls are ignored.
            if (!isCalled) {
              // 2.3.3.3.1
              promiseResolutionProcedure(promise2, y, resolve, reject);
              isCalled = true;
            }
          },
          (reason) => {
            // 2.3.3.3.3
            if (!isCalled) {
              isCalled = true;
              // 2.3.3.3.2
              return reject(reason);
            }
          }
        );
        //2.3.3.3.4 If calling then throws an exception e
      } else {
        // 2.3.3.4 If then is not a function, fulfill promise with x.
        resolve(x);
      }
    } catch (err) {
      if (!isCalled) {
        isCalled = true;
        // 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
        return reject(err);
      }
    }
  } else {
    //2.3.4 If x is not an object or function, fulfill promise with x.
    resolve(x);
  }
}
