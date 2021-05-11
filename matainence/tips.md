## 记录每天的小见闻

#### 2021-5-11

今天看到有个地方的代码挺有趣:

```js
// in constant.js
export const DEBUG_MODE = false;

// in api.js
import { DEBUG_MODE } from '../constant.js';

function someBusinessLogic() {
  try {
    // ...
  } catch (err) {
    DEBUG_MODE && console.log(err);
  }
}
```

这么写看着虽然有些奇怪，但是确实可以一定程度上的限制过多的 console 数量。也可以在生产环境上不依赖打包工具就处理掉 console 信息。

不过，似乎也可以封装一个新的方法，不然多个连续 console 都通过 && 进行链接有些不太美观了。我设想是这么改进：

```js
// in consoleUtils.js
import { DEBUG_MODE } from '../constant.js';
// or const DEBUG_MODE = false;
export function weconsole(...args) {
  DEBUG_MODE && console.log(...args);
}
```

这样是不是也可以通过同样的方式去控制呢？只有实践可以得知其中的问题了。
