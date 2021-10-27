### 通过常问的 webpack 面试问题，对比自己的理解和网上的大神理解的差异

#### 1. webpack 作用：

- 个人理解：通过 import/require 等字眼，去将模块之间的依赖联系起来，并构建成一个完整的包 bundle。然后在解析各个文件的过程中，loader 会去解析对应的模块（例如 tsloader，解析 ts、tsx 文件）并转成对应的 js, css, html 等内容。plugin 则是帮助构建时去做一些功能拓展，例如压缩文件等。

- 网上解答：

  - 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

  - 编译兼容(loader)。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过 webpack 的 Loader 机制，不仅仅可以帮助我们对代码做 polyfill，还可以编译转换诸如.less, .vue, .jsx 这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

  - 能力扩展(plugin)。通过 webpack 的 Plugin 机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

#### 2. 模块打包原理

- 个人理解：个人没有深入研究。只知道转成 ast 啥的然后去解析。

- 网上解答：

  简单了解一下 webpack 的整个打包流程：

  1、读取 webpack 的配置参数；
  2、启动 webpack，创建 Compiler 对象并开始解析项目；
  3、从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
  4、对不同文件类型的依赖模块文件使用对应的 Loader 进行编译，最终转为 Javascript 文件；
  5、整个过程中 webpack 会通过**发布订阅模式**，向外抛出一些 hooks，而 webpack 的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

  其中文件的解析与构建是一个比较复杂的过程，在 webpack 源码中主要依赖于 compiler 和 compilation 两个核心对象实现。

  - compiler 对象是一个全局单例，他负责把控整个 webpack 打包的构建流程。
  - compilation 对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，compiler 都会重新生成一个新的 compilation 对象，负责此次更新的构建过程。
  - 而每个模块间的依赖关系，则依赖于 AST 语法树。每个模块文件在通过 Loader 解析完成之后，会通过 acorn 库生成模块代码的 AST 语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。
  - 最终 Webpack 打包出来的 bundle 文件是一个 IIFE 的执行函数。

#### sourceMap 是啥？

sourceMap 是一项将编译、打包、压缩后的代码映射回源代码的技术，由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中 debug 问题会带来非常糟糕的体验，sourceMap 可以帮助我们快速定位到源代码的位置，提高我们的开发效率。sourceMap 其实并不是 Webpack 特有的功能，而是 Webpack 支持 sourceMap，像 JQuery 也支持 souceMap。
既然是一种源码的映射，那必然就需要有一份映射的文件，来标记混淆代码里对应的源码的位置，通常这份映射文件以.map 结尾，里边的数据结构大概长这样：

```json
{
  "version": 3, // Source Map版本
  "file": "out.js", // 输出文件（可选）
  "sourceRoot": "", // 源文件根目录（可选）
  "sources": ["foo.js", "bar.js"], // 源文件列表
  "sourcesContent": [null, null], // 源内容列表（可选，和源文件列表顺序一致）
  "names": ["src", "maps", "are", "fun"], // mappings使用的符号名称列表
  "mappings": "A,AAAB;;ABCDE;" // 带有编码映射数据的字符串
}
```

其中 mappings 数据有如下规则：

生成文件中的一行的每个组用“;”分隔；
每一段用“,”分隔；
每个段由 1、4 或 5 个可变长度字段组成；

有了这份映射文件，我们只需要在我们的压缩代码的最末端加上这句注释，即可让 sourceMap 生效：

```js
//# sourceURL=/path/to/file.js.map从v
```

有了这段注释后，浏览器就会通过 sourceURL 去获取这份映射文件，通过解释器解析后，实现源码和混淆代码之间的映射。因此 sourceMap 其实也是一项需要浏览器支持的技术。
如果我们仔细查看 webpack 打包出来的 bundle 文件，就可以发现在默认的 development 开发模式下，每个\_webpack_modules\_\_文件模块的代码最末端，都会加上//# sourceURL=webpack://file-path?，从而实现对 sourceMap 的支持。
sourceMap 映射表的生成有一套较为复杂的规则，有兴趣的小伙伴可以看看以下文章，帮助理解 soucrMap 的原理实现：
[sourceMap 生成逻辑](https://blog.fundebug.com/2018/10/12/understanding_frontend_source_map/)
