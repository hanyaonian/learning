# Reliability, scalability, maintainability

- 可靠性, 可伸缩性, 可维护性

## Thinking

现今很多应用程序都是 数据密集型（data-intensive） 的, 而非 计算密集型（compute-intensive） 的。因此 CPU 很少成为这类应用的瓶颈, 更大的问题通常来自数据量、数据复杂性、以及数据的变更速度。

数据密集型应用通常由标准组件构建而成, 标准组件提供了很多通用的功能；例如, 许多应用程序都需要:

- 存储数据, 以便自己或其他应用程序之后能再次找到 （数据库, 即 databases）
- 记住开销昂贵操作的结果, 加快读取速度（缓存, 即 caches）
- 允许用户按关键字搜索数据, 或以各种方式对数据进行过滤（搜索索引, 即 search indexes）
- 向其他进程发送消息, 进行异步处理（流处理, 即 stream processing）
- 定期处理累积的大批量数据（批处理, 即 batch processing）

example: A data system extract cache & text search functions from primary database.
![pub-sub](/assets/software-design/ddia-reading/1-1.png)

## Reliability

toleration hardware & software faults, Human error. 系统在 困境（adversity, 比如硬件故障、软件故障、人为错误）中仍可正常工作（正确完成功能, 并能达到期望的性能水准）。

**_最基本的要求_**

- 正常功能运作
- 用户离奇的操作也能容忍
- 性能满足要求
- 未经授权的滥用和访问能被限制

`可靠性` = 即便出故障也能满足上述基本要求;

三个阶段: 预防错误(安全问题) , 容忍错误 , 阻止错误. netflix 的 `chaos monkey` 是一个很好的例子, 故意触发错误来保证容错机制运行正确, 并接受考验.

### 硬件错误

- 硬件的冗余度, 例如: 磁盘可以组建 RAID, 服务器可能有双路电源和热插拔 CPU, 数据中心可能有电池和柴油发电机作为后备电源, 某个组件挂掉时冗余组件可以立刻接管
- 软件的冗余度, 例如: 多节点机器升级维护, 可以一个节点一个节点的处理(无需停机)

### 软件错误

- 系统资源耗尽, cpu/内存/disk/network
- system lagging/froze

### 人为错误

- corner case testing
- 合理的监控

### 重要性

## Scalability

measuring load & performance latency percentiles, throughput (吞吐量)

## Maintainability

operability, simplicity & evolvability
