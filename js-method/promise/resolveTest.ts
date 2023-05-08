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
// for resolve test cases, excpected output are:
/**
 	true
	Success
	fulfilled!
	TypeError: Throwing
	Resolving
	resolve async promise ok
 */
