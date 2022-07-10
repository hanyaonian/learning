# 利用vite改造传统静态站点

Inspired by devi.

前段时间接手了一个基于jquery比较老的web项目，遭遇了大量难以维护的问题，大约如下：

  1. 单html文件就有数千行, js文件、html内都有定义js变量、方法
  2. js交互逻辑又是过千行, 都是传统的window上挂载变量, 没有代码模块这一说, 没有用npm
  3. 没有加入任何环境控制、编译工具处理(以前的老项目会gulp跑一下，压缩一下代码体积), 测试/现网的接口控制完全是靠发版。。
  4. html入口有多个，里面引用的公共代码复制了一份又一份.

虽然是个维护项目，不需要我加入新功能，但是我很难接受这么难以维护的一坨东西挂在我名下，要是转交出去别人可能以为这一坨是我处理的。。那么改造一下，起码让人拿到项目的时候一看知道自己应该从哪里入手。

## 为什么需要web模块化？

js模块化机制将js代码拆分到不同的细小文件中，有以下优点：

- 每个文件都具有私有命名空间，避免全局污染、变量冲突。（闭包）
- 逻辑分离，可以将不同逻辑代码放在不同的js文件中。
- 提高代码的可复用性、可维护性和可读性

## 为什么用 vite 去做工程改造？

webpack, parcel等其他工具一样能做到，但vite最近常用且配置非常简单~ 用vite有以下几个优点:

  1. 配置简单，开箱即用
  2. 静态web站点需要web服务去做开发、访问，vite正好提供了一个web开发服务以及hmr，同时加入这个工具开发体验不是割裂式的，不修改项目结构直接启动web serve不会有跑不起来之类的状况

  3. 定制项目插件简单(plugin)
  4. 快，比webpack快，比parcel快

## 项目改造

项目难以维护的原因在上面已经提到了，那么相应的解决方案呢？

- 问题1: html 巨多, 尤其是这种jquery项目, 很多内容要在html里面去找

  解决方案1: 模板引擎, 例如pug, 可以将html分块, 页面内容可以模块化管理.
  解决方案2: 原html内容改造成snippets
  实施: 改造snippets. 考虑到接手的人没接触过模板引擎，可能对内部语法不熟悉.

- 问题2: js 文件多, 没有代码模块, 全局变量满天飞

  实施: 抽离公共代码, 代码改成esm, 引用npm模块依赖, 构建环境转cdn.

- 问题3: 有加入任何环境控制、编译工具处理

  实施: 这就是为什么要用vite.

- 问题4: html入口有多个

  实施: vite 支持多html入口, 公共代码提取是问题2共同面临的.

### 相关改造代码

#### 如何将纯html项目通过vite 碎片化?

举个简单的例子: 页面A和页面B，都需要在用户点击查看隐私条款后，弹出网页的隐私条款弹窗，而里面的隐私条款内容对全网站来说是一致的。没有模块化的项目（例如我接手的这个），就会将过千行的条款又复制一次过来。那么过了一年，隐私条款更新了。

`oh shit!` 维护者说到， `我竟然要把这一大串html复制四五次，我甚至不知道有没有复制少！`.

如果使用了模板引擎(pug之类的), vue, angular, react 都不会面临这个困境，因为他们都可以`模块化`, `组件化` 多个地方使用的一样的内容. 我们如何不转编html到模板引擎的同时又用到模板引擎的这个基础功能呢?

答案是 vite 的compile hook. vite 是在rollup再上一层，rollup虽然可以加插件去在生命周期里去做一些操作，但似乎没有针对html的。而vite则有这个功能（[文档](https://vitejs.dev/guide/api-plugin.html#transformindexhtml)), ([中文文档](https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml)).

我们可以在plugins的配置里加入一个这样的方法, 去把html里的一些`标记` 给替换成相应的html:

```js
// vite.config.js
import fs from 'fs';
import path from 'path';

const resolve = (...filePath) => path.resolve(__dirname, ...filePath);

const getHtmlSnippet = (file) => fs.readFileSync(resolve('./snippets', file), { encoding: 'utf8' });

function replaceSnippets() {
  const snippets = fs.readdirSync(resolve('./snippets'));
  return {
    name: 'replace-snippets',
    enfore: 'pre',
    transformIndexHtml(html) {
      snippets.forEach((snippet) => {
        const [filename, _type] = snippet.split('.');
        html = html.replace(`<!-- @${filename} -->`, getHtmlSnippet(snippet));
      });
      return html;
    };
  };
}
```

在html文件里，把那些烦人的重复的特别多的html给移出去, 替换成这样:

```html
<!-- some of your html -->

<h1> Here is our Privacy policy: </h1>

<!-- @privacy-policy -->
```

移出去的重复html代码放哪呢, 放到`snippets` 文件夹下, 保留其文件名的html后缀，这样你还能享受html的ide的语法高亮.
当然这个方案和模板引擎差距很大，但是对接手的人来说，他得到的是不需要重新学习模板引擎，又能享受洁净一点的html～

```html
<!-- this is file of snippets/privacy-policy.html, this will replace <\!-- @privacy-policy --\> in html file -->

blah blah blah...
```

#### 如何进行多入口构建?

这个也十分简单，参考vite的[官方文档](https://cn.vitejs.dev/guide/build.html#multi-page-app)即可:

```js
// vite.config.js
import path from 'path';
import { defineConfig } = from 'vite';

const resolve = (...filePath) => path.resolve(__dirname, ...filePath);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        nested: resolve('nested/index.html')
      }
    }
  }
})
```

#### 如何复用全局变量js文件 ?

这个是因为工作量实在太大了，有些代码是不知道哪里祖传的，不是npm包，但里面的内容又都是需要挂在在window上的...这会引发几个问题：

1. 如果你直接将js的代码以 `<srcipt src='xxx.js'></script>` 的形式引入进去是不会生效的～因为vite只会处理 esm 的js文件
2. 如果你在代码文件里去 import 这些需要挂载在window的代码，也不会生效，因为这些代码esm引入之后就是闭包的了不是全局的了～

解决办法是什么呢～vite也给了一个方法：[看着](https://vitejs.dev/guide/assets.html#importing-asset-as-string)

```js
import `something-globle-js?raw`;
```

那么在构建的时候，这个代码就是直接以js的形式构建进产物里了～自然也可以被插入到代码头内作为全局代码～
