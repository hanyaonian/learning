- 事件循环是 JS 线程处理的还是浏览器处理的？

  - 浏览器处理的。在 nodejs 上又是别的事件处理机制。
    > Node.js 采用 V8 作为 js 的解析引擎，而 I/O 处理方面使用了自己设计的 libuv，libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API，事件循环机制也是它里面的实现。libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
    > 浏览器中，引用 wiki：“Event Loop 是一个程序结构，用于等待和发送消息和事件”。有一个专门负责和主线程与其他进程的通信（I/O，请求），event loop 线程。

- 当前任务队列都为空，会怎么做

  - 啥也不干（idle），等到下个任务出现

- 浏览器里有一些 js 脚本（a、b、c、d 等顺序排列），一些 css 样式表，问加载执行顺序的相关问题。

  - 如果没有加 defer，async，都是按顺序进行加载、执行，上一个没加载前是不会加载下一个的；且 js 与 css 未加载完不会进行页面渲染。css 放头部，js 放尾部可以最快的渲染出页面内容。（红宝书第二章）

- ['1', '2', '3'].map(parseInt) what & why ?

  - parseInt: 第一个参数是数字字符，第二个参数 radix 是表示进制；map func 的第一个参数是 value，第二个参数是 index。因此执行过程实际上是 1 0 进制，2 1 进制， 3 2 进制。超了进制所以是 NaN。MDN 对 parseInt 第二个参数的解释：从 2 到 36，表示字符串的基数。
    如果 radix 是 undefined、0 或未指定的，JavaScript 会假定以下情况： 1. 如果输入的 string 以 "0x"或 "0x"（一个 0，后面是小写或大写的 X）开头，那么 radix 被假定为 16，字符串的其余部分被当做十六进制数去解析。 2. 如果输入的 string 以 "0"（0）开头， radix 被假定为 8（八进制）或 10（十进制）。具体选择哪一个 radix 取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。因此，在使用 parseInt 时，一定要指定一个 radix。 3. 如果输入的 string 以任何其他值开头， radix 是 10 (十进制)。 4. 如果第一个字符不能转换为数字，parseInt 会返回 NaN。

- 列表组件中写 key，其作用是什么(看过源码，忘了。。。)？

  - 文档内说明：不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。key 不正确出现过什么问题：做 vrs 的时候，重复下单同一个商品的 key 一致，ui 渲染出现紊乱，因为识别 key 相同导致 ui 未更新，实际上内容是有更新的。
  - https://juejin.cn/post/6844904113587634184

- tcp3 次握手能带些什么其他东西

  - (zhihu)TCP 标准规定，第三次握手的报文，可以携带数据。因为此时客户端已经处于 established 状态了。假设第三次握手的报文的 seq 是 x+1，如果有携带数据，下次客户端发送的报文，seq=服务器发回的 ACK 号。如果没有携带数据，那么第三次握手的报文不消耗 seq。下次客户端发送的报文，seq 序列号还是和第三次握手的报文的 seq 一样，为 x+1。这是因为，seq 和报文中的数据在整条数据流流中的位置是一一对应的。如果报文没有携带数据，那么 seq 当然也不会更新。[图](http://d3ojx0qwvsjea2.cloudfront.net/wp-content/uploads/2016/12/24160105/Three-way-Handshake-ex2.png)

- response header 里浏览器可以获取到的信息：
- preload 作用
  - link 元素的 rel 属性的属性值 preload 能够让你在你的 HTML 页面中 head 元素内部书写一些声明式的资源获取请求，可以指明哪些资源是在页面加载完成后即刻需要的。对于这种即刻需要的资源，你可能希望在页面加载的生命周期的早期阶段就开始获取，在浏览器的主渲染机制介入前就进行预加载。这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。
  - 先通过 link 的方式预下载脚本，需要使用的时候再把资源插入成 script。
  - 预加载适合在 CSS 文件中指向的资源，比如字体或是图片；再比如更大的图片和视频文件
  - 对于字体文件，即使是在非跨域的情况下也要以匿名模式使用 CORS
  ```html
  <link
    rel="preload"
    href="webfont.woff"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  ```
- 不同 tab 之间的 web 页面怎么通讯？

  - localStorage: 给 'storage'事件增加监听器，一方存储另一方接收
  - [postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
  - iFrame 可以通过(Channel Messaging API 的 MessageChannel 接口允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据。)

- Eventbus 相关

  - eventbus 在 vue1 中比较常用（难怪不太了解）， 在 vue2 后已经通讯比较方便了，实在不行也可以自己实现一个 emitter 去进行通讯。参考 design-pattern 里写的发布订阅模式，可以进行跨组件通讯

- DOMContentLoaded 和 window.onload 哪个先执行。

  - DOMContentLoaded：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。（NOTE：同步 JavaScript 会暂停 DOM 的解析。）
  - window.onload：当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发 load 事件。

- 变更 URL 不刷新浏览器页面(没用过)

  - history.pushState() 和 history.replaceState() 方法，它们分别可以添加和修改历史记录条目。

- addeventlistener 第三个参数作用(不要写过就忘。)?

  - el.addEventListener(type, listener, useCapture)
    > 由于 touchmove 事件对象的 cancelable 属性为 true，也就是说它的默认行为可以被监听器通过 preventDefault() 方法阻止。那它的默认行为是什么呢，通常来说就是滚动当前页面（还可能是缩放页面），如果它的默认行为被阻止了，页面就必须静止不动。但浏览器无法预先知道一个监听器会不会调用 preventDefault()，它能做的只有等监听器执行完后再去执行默认行为，而监听器执行是要耗时的，有些甚至耗时很明显，这样就会导致页面卡顿。即便监听器是个空函数，也会产生一定的卡顿，毕竟空函数的执行也会耗时。当设置了 passive 为 true，则会忽略代码中的 preventDefault(), 因此页面会变得更流畅。

  ```js
  // 新规范
  el.addEventListener(type, listener, {
    capture: false, // useCapture
    once: false, // 是否设置单次监听
    passive: false // 是否让阻止默认行为preventDefault()失效
  });
  ```

- 外边距坍塌啥情况？
  - 同一层相邻元素之间。相邻的两个元素之间的外边距重叠，除非后一个元素加上 clear-fix 清除浮动。（博客的 title 和正文真的坍塌了，omg！！）
  - 空的块级元素：当一个块元素上边界 margin-top 直接贴到元素下边界 margin-bottom 时也会发生边界折叠。
  - 没有内容将父元素和后代元素分开（记一下吧。。。）
