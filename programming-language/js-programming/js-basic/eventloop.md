# Event Loop

**JavaScript 有一个基于事件循环的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务**

MDN:

- 一个 JavaScript 运行时包含了一个待处理消息的消息队列。每一个消息都关联着一个用以处理这个消息的回调函数。
- 在 事件循环 期间的某个时刻，运行时会从最先进入队列的消息开始处理队列中的消息。被处理的消息会被移出队列，并作为输入参数来调用与之关联的函数。正如前面所提到的，调用一个函数总是会为其创造一个新的栈帧。
- 函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）。

个人理解：

- 每完成当前执行的内容，就回去检查一下任务队列有无新的任务。**任务队列就是你在主线程上的一切调用** 异步任务完成（回调）或浏览器产生事件后，事件就会被放进队列中等待被处理。
- 任务又分微任务、宏任务，宏任务执行完后执行完所有微任务才会继续到下一个宏任务。
- 做异步的操作的内容时，很多任务是在其他线程做的，例如：浏览器的下载线程下载完成后给消息队列添加了一个下载完成的事件触发；nodejs 的异步线程操作完也会加入事件回调，例如 fileSystem。

## 浏览器线程组成

一个 tab 是一个进程

  1.  Js 线程
  2.  UI 渲染线程（GUI）
  3.  浏览器事件触发线程（属于浏览器）
  4.  网络请求线程（异步 http 请求）
  5.  eventLoop 线程

单线程不阻塞 I/O 是因为异步的事情交给其他线程去处理了，从而不影响主线程（单线程）运作。可以将主线程描述成一个服务员，服务员可以不停的接到顾客的点菜要求（浏览器顾客可能要：XHR 请求、下载文件；nodejs 顾客可能要读写文件、处理运算），然后服务员将这些点菜的请求交给厨房里的厨师（不同厨师不同线程），这个过程不影响服务员服务其他顾客。厨师在做完菜后，菜（回调任务，结果）放入到消息队列，服务员做完手头上的事就会一个个菜拿给对应的顾客，且不上完上一个菜不会服务下一个顾客。

- eventloop执行顺序-伪代码：

```js
for (macrotask of macrotaskQueue) {
  // doMacrotask()...
  for (microtask of microtaskQueue) {
    //  doMicrotask()...
  }
}
```

- 执行宏任务时，还可以插入微任务，但在微任务完成前，不会到下一个宏任务。

示例代码1

```js
setTimeout(function () {
  console.log('1');
});
new Promise(function (resolve) {
  console.log('2');
  resolve();
}).then(function () {
  console.log('3');
});
console.log('4');
// 输出： 2 4 3 1
```

示例代码2

```js
async function async1() {
  console.log('a1 start');
  await async2();
  console.log('a1 end');
}
async function async2() {
  console.log('a2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
  console.log('p1');
  resolve();
}).then(function () {
  console.log('p2');
});
console.log('script end');
/*
输出:
script start 
a1 start
a2 (队列新任务)
p1
script end
a1 end (await 之后的相当于是Promise.then，微任务)
p2 (微任务)
setTimeout (宏任务)
 */
```

### event loop summary

- 宏任务主要有：整体 script 代码、setTimeout、setInterval、I/O（UI 交互等）、requestAnimationFrame
- 微任务主要有：Promise、process.nextTick、MutationObserver
- 人为构造微任务示例: Vue2 中的 nextTick，就是优先用微任务，以保证其尽快执行 nextTick 的回调（Promise, 或采用 MutationObserver 观察一个文本 node 节点触发）

- **特点总结**

  + 特点1: 执行至完成
    - 每一个消息完整地执行后，其它消息才会被执行。这为程序的分析提供了一些优秀的特性，包括：当一个函数执行时，它不会被抢占，只有在它运行完毕之后才会去运行任何其他的代码，才能修改这个函数操作的数据。
    - 这个模型的一个缺点在于当一个消息需要太长时间才能处理完毕时，Web 应用程序就无法处理与用户的交互，例如点击或滚动(其实任意在跑阻塞了线程的内容都会让用户无法交互，不单是在消息里)。
    - 如何避免此类回调引起的阻塞？
      - 缩短单个消息处理时间，并在可能的情况下将一个消息裁剪成多个消息
      - 将需要大量逻辑处理的内容放到 service worker 等内容中去

  + 特点2: 添加消息
    - 在浏览器里，每当一个事件发生并且有一个事件监听器绑定在该事件上时，一个消息就会被添加进消息队列。如果没有事件监听器，这个事件将会丢失。所以当一个带有点击事件处理器的元素被点击时，就会像其他事件一样产生一个类似的消息。
    - 函数 setTimeout 接受两个参数：待加入队列的消息和一个时间值（可选，默认为 0）。这个时间值代表了消息被实际加入到队列的最小延迟时间。如果队列中没有其它消息并且栈为空，在这段延迟时间过去之后，消息会被马上处理。但是，如果有其它消息，setTimeout 消息必须等待其它消息处理完。因此第二个参数仅仅表示最少延迟时间，而非确切的等待时间。

  + 特点3: 零延迟
    - 其等待的时间取决于队列里待处理的消息数量。

## 参考

- https://juejin.cn/post/6844903657264136200
- https://medium.com/@paul_irish/requestanimationframe-scheduling-for-nerds-9c57f7438ef4