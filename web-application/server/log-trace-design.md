# Node.js 服务中的 Trace 设计 - AsyncLocalStorage

`AsyncLocalStorage` is a Node.js API (based on the async_hooks API) that provides an alternative way of propagating local state through the application without the need to explicitly pass it as a function parameter. It is similar to a thread-local storage in other languages.

## 简介

`AsyncLocalStorage` 是 Node.js 提供的一个 API，用于在异步操作中保持上下文数据。它是实现分布式追踪(分布式链路追踪)的核心工具。

## 为什么需要 Trace 设计

1. 在微服务架构中追踪请求全链路
2. 诊断复杂的异步调用问题
3. 收集性能指标和日志上下文

## 劣势

- 造成 6% 左右的性能损失(网上的结论)

## TypeScript 实现示例 (AI)

```typescript
import { AsyncLocalStorage } from "async_hooks";

// 1. 创建 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

// 2. 中间件实现
function traceMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = req.headers["x-trace-id"] || generateTraceId();

  asyncLocalStorage.run({ traceId }, () => {
    // 在这个异步上下文中，可以随时获取 traceId
    next();
  });
}

// 3. 在任意位置获取当前上下文
function someBusinessLogic() {
  const store = asyncLocalStorage.getStore();
  console.log(`当前TraceID: ${store?.traceId}`);

  // 异步操作也会保持上下文
  setTimeout(() => {
    const store = asyncLocalStorage.getStore();
    console.log(`异步中的TraceID: ${store?.traceId}`);
  }, 100);
}

// 辅助函数：生成TraceID
function generateTraceId(): string {
  return Math.random().toString(36).substring(2, 10);
}
```

## 使用场景

1. **请求追踪**：为每个请求分配唯一 ID 并贯穿整个生命周期
2. **日志关联**：将同一请求的所有日志关联起来
3. **性能监控**：测量异步操作的耗时

## 注意事项

1. 性能影响：AsyncLocalStorage 有轻微性能开销
2. 内存泄漏：确保及时清理不再需要的存储
3. 上下文丢失：某些特殊 API 可能会中断上下文传递

## 最佳实践

1. 为每个请求创建独立的存储
2. 在中间件中初始化上下文
3. 避免存储大型对象
4. 结合日志系统使用

## Ref

- https://juejin.cn/post/7233625509107499067
- https://docs.nestjs.com/recipes/async-local-storage
- https://nodejs.org/api/async_context.html#class-asynclocalstorage
