# Common knowledge in Cache design of web application

The main function of `Cache` is to improve response speed and reduce disk reads.

## Common Issues

The three main questions that the desgin of `Cache` facing are:

- Cache penetration 缓存穿透
- Cache Avalanche 缓存雪崩
- Hotspot invalid 缓存击穿

### Cache penetration

- [Bloom Filter](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html)

### Cache Avalanche

### Hotspot invalid

-

## Reference

- [reference: redis-caching-avalanche-and-caching-penetration](https://github.com/doocs/advanced-java/blob/main/docs/high-concurrency/redis-caching-avalanche-and-caching-penetration.md)
