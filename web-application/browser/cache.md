# Caching

## HTTP Caching

### Private

typically browser cache.

- Expires, Cache-Control, Vary, If-Modified-Since/If-None-Match/ETag

### Shared

- Proxy Caches
- Managed Caches (CDN, etc..)

### HTTP Heuristic Cache

- To ensure that by default the latest versions of resources will always be transferred, it's common practice to make the default Cache-Control value include no-cache (Better for entrance)
- **_ Heuristic caching is a workaround that came before Cache-Control support became widely adopted, and basically all responses should explicitly specify a Cache-Control header. _**

## Reference

- HTTP: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Caching
- Service worker: https://developer.mozilla.org/zh-CN/docs/Web/API/Cache
