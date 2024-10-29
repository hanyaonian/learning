# Abort controller

- Reference: https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController

## Usage

```js
let controller;
let url = "some-url";

function request() {
  controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((response) => {
      console.log("下载完成", response);
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "AbortError") {
        console.error(`主动取消：${err.message}`);
      } else {
        console.error(`下载错误：${err.message}`);
      }
    });
}

request();

controller?.abort();
```

## Listener

- listener 参数对象; 支持移除监听器

```js
// previous
class SomeClass {
  listen() {
    /** ... **/
  }
  init() {
    // other event...
    window.addEventListener("message", this.listen);
  }
  destroy() {
    // ... 假如有多个, 需要写入多次
    window.removeEventListener("message", this.listen);
  }
}

// now
class SomeClass {
  abortcontroller = new AbortController();
  listen() {
    /** ... **/
  }
  init() {
    // other event...
    window.addEventListener("message", this.listen, {
      signal: this.abortcontroller.signal,
    });
  }
  destroy() {
    this.abortcontroller.abort();
  }
}
```

## 拓展 - 工具类

- 支持 重试/可取消/可替换/可限频&唯一 的请求类 - from devi
- 参考: https://vueuse.org/core/useFetch/

有空时做一个不依赖框架的实践
