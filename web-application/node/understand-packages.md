# 理解 node.js modules

问题背景, 一段很简单的代码, 基于`axios`(一个 nodejs/browser 均可运行的 http 请求库, 非常流行)做一个简单的请求测试.

```ts
// example
import axios from "axios";

const main = async () => {
  console.log(await axios.post("https://some-url.com"));
};

main();
```

参考的 rollup 配置

```js
// rollup.config.mjs
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: "./test.ts",
    output: {
      file: "dist/index.js",
      format: "iife",
    },
    plugins: [
      resolve({
        // 使用browser的conditional export.
        browser: true,
      }),
      json(),
      commonjs(),
      typescript(),
    ],
  },
];
```

编写完成后, rollup 打包后的代码无法在浏览器中执行, 原因是构建产物中带有 node.js 的模块.

这个问题很好解决, 在`@rollup/plugin-node-resolve`的插件传入参数 browser: true, 打包出来的内容就是纯浏览器的了。

## 问题

1. 在打包构建时, 系统是如何区分产物是走 browser 还是 node 的呢?

   这个是调用侧决定的, 毕竟“bundle”这个动作始终都是 nodejs 环境运行的...

2. 如何做一个多环境包?

   如果一个 npm 软件包支持多个运行环境且不同环境有多个程序入口, 如 axios, 那么 conditional exports 去声明不同环境对应的入口. 可以参考此篇内容: https://nodejs.org/api/packages.html#conditional-exports.

## 概念词

- exports 字段概念: The "exports" provides a modern alternative to "main" allowing multiple entry points to be defined, conditional entry resolution support between environments, and preventing any other entry points besides those defined in "exports". This encapsulation allows module authors to clearly define the public interface for their package.

- coditional exports 概念: Conditional exports can be used within "exports" to define different package entry points per environment, including whether the package is referenced via require or via import.

```json
{
  "exports": {
    ".": "./index.js"
  }
}

// 等价于 "exports": "./index.js"
```

## Reference

- 笔记 https://github.com/SunshowerC/blog/issues/8
- conditional export: https://nodejs.org/api/packages.html#conditional-exports
- package entry points: https://nodejs.org/api/packages.html#packages_package_entry_points
