# 前端基础建设

## 一、npm 模块加载

- ### CI 环境下的 npm 安装优化

```sh
npm ci
```

npm install 和 npm ci 的主要区别是()：

0. 跳过某些面向用户的功能，它可以比常规的 npm 安装快得多
1. 该项目必须有一个 package-lock.json 或 npm-shrinkwrap.json。
2. 如果 package-loc 中的依赖项与 package.json 的依赖项不匹配，npm ci 则将退出并显示错误，而不是更新 package-lock。
3. npm ci 只能一次安装整个项目：使用此命令无法添加单个依赖项。
4. 如果 node_modules 已经存在，它将在 npm ci 开始安装之前自动删除。
5. 它永远不会写入 package.json 或任何包锁：安装基本上是冻结的。

- ### lockfile 生成过程

1. 有 lockfile -> 对比 lockfile 和 package.json 是否一致
   - 一致：根据 lockfile 的信息去缓存/网络中加载依赖
   - 不一致：根据 npm 的版本进行对应处理
2. 无 lockfile
   - 根据 package.json 构建依赖树，有缓存则解压缓存，无则从网络下载并添加缓存
   - 缓存策略：根据 lock 中存储的信息去生成对应的缓存哈希，快速定位到缓存的包

- ### lockfile 提交到仓库的作用（是否需要呢）

1. 不同版本的 npm 安装依赖机制不同
2. npm install 会根据 package.json 去更新依赖，某些依赖可能会更新版本, 通过 lock 可以锁定版本号
3. 如果开发的库引用了一样的依赖但是不同版本，那么每个版本都会下载一次(lock file 限定了版本)
4. 如果有特定版本依赖需求，建议**peerDependencies**
   > peerDependencies: 如果某个 package 把我列为依赖的话，那么那个 package 也必需应该有对 PackageB 的依赖。这样就可以保证上下层对依赖的统一。

## Babel 相关(该部分内容实际接触较少)

- ### 依赖代码不兼容，babel compile fail

- 默认情况下 babel-loader 会忽略 node_modules 的代码，如果想处理依赖，需要通过 transpileDependencies 去进行转译依赖。（babel 配置内容中可以配置 sourceType: unambiguous + overrides 去进行一个 module/require 依赖处理）

- ### 按需打包实现(项目已基于 babel-plugin-import 实现)

1. 使用 es module 的 tree shaking 方案，构建工具打包时按需打包(package.json 中注意设置 sideEffects)
2. 使用 babel-plugin-import 插件完成按需打包

- ### 代码拆分&按需加载

- webpack
  1. 入口配置手动分割代码（如项目实践中的报表分 entry 进入）
  2. 动态导入支持：() => import('url...'), 或者 webpackMode: lazy
      > 最终是 webpack 转换成一个 promise 数组，然后通过 jsonp 的形式去加载模块内容，加载成功就把 promise 数组对应的内容填上，其他也引用的就不需要再异步加载。
  3. splitChunk 提取公共代码(避免重复打包，提升代码利用率，webpack 一般是自动配置，不建议自己操作。。。)
