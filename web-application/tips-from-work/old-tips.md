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

#### 2021-5-20

修改播放组件的时候, 接触到了一些新的概念，记录一下：

1. dom 结构作为字符串存储，插入到 html 之后，获取到其元素再做对应的组件化操作；
2. 使用 Parcel 进行快速的原型 demo 开发；
3. 通过 rollup 进行代码打包，可以有效的减少代码量；

#### 2021-7

工作有点忙，回来以后疲于玩乐，忘记学习了，记录一下近期的收获：
Protocol Buffer : google 的一种数据协议，用来前后端交互可以提升传输的性能，并且统一协议（多端同构）
Transition group : 在 vue 中进行列表过渡可以有效提升用户体验；

#### 2021-10

监控上报: 监听 window.onerrror、重写 xmlhttprequest 的方法可以实现静态文件、请求相关的内容监控
