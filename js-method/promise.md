### [Promise 规范](https://promisesaplus.com/)

以下节选关键内容，作为实现依据。
#### 术语
- "promise"是具有then方法的对象或函数，其行为符合此规范。
- "thenable"是定义then方法的对象或函数。
- "value"是任意合法的Javascript值，（包括undefined,thenable, promise）
- "exception"是使用throw语句抛出的值
- "reason"是表示promise为什么被rejected的值

#### 状态
一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
- Pending: 可以迁移至执行态或拒绝态
- Fulfilled: 必须拥有一个不可变的终值; 状态不可变
- Rejected: 必须拥有一个不可变的据因; 状态不可变

#### then 方法
- 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
- promise 的 then 方法接受两个参数: promise.then(onFulfilled, onRejected), 两个参数必须是函数。
	1. onFulfilled, 第一个参数为 promise 的终值 value
	2. onRejected, 第一个参数为 promise 的拒因 reason
- then 必须返回一个promise对象
	````js
	promise2 = promise1.then(onFulfilled, onRejected);  
	````
	- 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
	- 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
	- 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
	- 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因

