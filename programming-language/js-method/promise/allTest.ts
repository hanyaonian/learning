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
