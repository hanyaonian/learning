# 多线程资源访问问题

常见资源处理方案

- 信号量
- 读写锁
- 互斥锁 mutex
- 原子操作
- 线程池
- 条件变量

## 信号量

信号量（Semaphore）是一种用于控制多个线程对共享资源的访问的同步机制。它可以用来限制并发访问的数量，或者用来实现线程间的通信。以下是信号量的一些典型使用场景：

- 资源限制：当有多个线程需要访问某一有限资源（如数据库连接池中的连接）时，可以使用信号量来限制同时访问该资源的线程数量。这样可以防止资源过载。
- 同步操作：信号量可以用来确保某些操作的顺序执行。例如，在生产者-消费者模型中，生产者线程生产数据后，通过信号量通知消费者线程可以开始消费。
- 互斥访问：虽然互斥锁（Mutex）也可以用于控制对共享资源的独占访问，但信号量提供了更灵活的控制方式。例如，一个信号量可以允许多个线程同时访问某个资源，只要它们的总数不超过信号量的值。
- 线程间通信：信号量可以作为一种简单的线程间通信机制。线程可以通过改变信号量的值来向其他线程发送消息，表明某种状态的变化。

典型场景 1: 并发请求某接口资源, 需要限制并行数量

```ts
// https://www.npmjs.com/package/async-sema

const { Sema } = require("async-sema");
const s = new Sema(
  4, // Allow 4 concurrent async calls
  {
    capacity: 100, // Prealloc space for 100 tokens
  }
);

async function fetchData(x) {
  await s.acquire();
  try {
    console.log(s.nrWaiting() + " calls to fetch are waiting");
    // ... do some async stuff with x
  } finally {
    s.release();
  }
}

const data = await Promise.all(array.map(fetchData));
```

典型场景 2:

```ts
// 假设有一堆 async 操作
var tasks: Promise<void>[];

// normal case 1 - 排队一个个整, n * single time
for (const task of tasks) {
  await task();
}
// normal case 2 - 全部一起跑, 有可能并发太高了, 导致影响业务逻辑, exceed max capacity
await Promise.all(tasks);

// async sema case:
const s = new Sema(max_capacity_num);
const sema_tasks = tasks.map(async (task) => {
  await s.acquire();
  try {
    await task();
  } finally {
    s.release();
  }
});
await Promise.all(sema_tasks);
```
