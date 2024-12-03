# Head-of-Line Blocking

When a single (slow) object prevents other/following objects from making progress.

origin: https://github.com/rmarx/holblocking-blogpost

## Http/1.0/1.1

- 整个 HTTP 请求就是一个纯文本协议, header + payload, 不会去对请求做更多区分. 这造成了几个问题
  1. 无法多路复用 (无法区分回包);
  2. 必须完整传输完才能进行下一个请求 (无法做到 resource chunk);
  3. 为了解决 2. 会并行多个请求, 但是多个 tcp 开销很大;

## Http/2

具体 Http/2 的特点可以在[此处](./http1.1-http3.md)看到.

引用原文说明 Http/2 如何比 1.0/1.1 更灵活的:

- It allows for many resources to be sent multiplexed on a single TCP connection by interleaving their chunks.
- It also solves HOL blocking in the case of a slow first resource: instead of waiting for the database-backed index.html to be generated, the server can simply start sending data for other resources while it waits for index.html. (此处按我理解是可以通过 server push 现将 css 或 js 之类的内容回推)

从 http 的层面上来看, Http/2 已经解决了 hol 问题, 因为可以多路复用 + 优先级控制回包顺序. [Http/2 的优先级控制](https://blog.cloudflare.com/better-http-2-prioritization-for-a-faster-web/).

### HOL in Http/2

问题还有”tcp 层“队头阻塞(tcp & http 视野不对等)：

假设一个资源拆分了多个 packet, packet 3 先到达，那么 tcp 会等待 packet 2 到达后，才将 packet 2 & 3 送给浏览器 (packet 1 & 3 同属一个 stream 但是无法连续, 因此发现丢包后会重传 packet 2, packet 3 在缓冲区中等待)。假如此 packet 包含了不同 stream 的数据, 那么多个 stream 都会被阻塞直到重传完成.

In conclusion, the fact that TCP does not know about HTTP/2's independent streams means that TCP-Layer HOL blocking (due to lost or delayed packets) also ends up HOL blocking HTTP!

## Http/3 (QUIC-based)

TODO
