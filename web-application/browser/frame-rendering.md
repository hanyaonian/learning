# Rendering in browser

- Life of a frame:
  ![alt text](/assets/browser/life-of-a-frame.png)

- anatomy of a frame
  ![alt text](/assets/browser/anatomy-of-a-frame.png)

总而言之，渲染过程顺序可以总结为如下:

1. User Input 处理输入
2. JS: Macro task & Micro Task (See: `web-application/browser/task-schedule.md`)
3. rAF (requestAnimationFrame)
4. browser rendering (parse html -> recaic styles 计算样式 -> layout 计算几何信息 -> update layer tree 处理堆叠上下文和排序元素 -> paint -> composite)
5. Frame end, 屏幕上呈现内容
6. requestIdleCallback, 如果 Main Thread 在帧结束时有空余时间，那么 requestIdleCallback 可以触发; 这里适合做数据收集等任务;

## 从渲染的角度来看如何让页面不卡

60fps 一般来说就是属于流畅的范畴, 1000ms/60 = 16ms; 如果任何 js 执行超过 16ms 就会造成阻塞。

[RAIL](https://web.dev/articles/rail) 则说明，用户交互到互动反应的这个动作要限制在 100ms 内，处理输入则是要在 50ms 内。

检查标准:

requestAnimationFrame -> requestIdleCallback 之间不超过 16ms. 这就是一帧.

### 任务拆分

Goal:

- 任务支持暂停与继续执行
- 用户输入在 16ms 内处理完成

### HOW

这里说明如何去做任务调度与拆分, 参考: React fiber

## 参考

- https://web.dev/articles/rail
- https://juejin.cn/post/6844903657264136200
- https://medium.com/@paul_irish/requestanimationframe-scheduling-for-nerds-9c57f7438ef4
- 一个非常好的实践: https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask
