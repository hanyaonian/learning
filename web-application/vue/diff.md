#### Vue diff 过程

tx 一面的时候问了一个问题，关于 diff 的，让说一下 diff 的流程。很可惜，我没有深入研究源码，主要还是通过看网上的解析，如 huangyi 的 vue-analysis 项目。所以说的也不明不白的。

现在重新再看一下 vue-analysis/v2/data-driven/virtual-dom，并结合其中的源码重新简单理解一下。

### 挂载

mountComponent 核心就是先实例化一个渲染 Watcher，在它的回调函数中会调用 updateComponent 方法，在此方法中调用 vm.\_render 方法先生成虚拟 Node，最终调用 vm.\_update 更新 DOM。

Watcher 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数，这块儿我们会在之后的章节中介绍。

函数最后判断为根节点的时候设置 vm.\_isMounted 为 true， 表示这个实例已经挂载了，同时执行 mounted 钩子函数。 这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。

### template 到真实 dom 的过程---Compile（了解一下，看不懂。。。）

Vue.js 提供了 2 个版本，一个是 Runtime + Compiler 的，一个是 Runtime only 的，前者是包含编译代码的，可以把编译过程放在运行时做，后者是不包含编译代码的，需要借助 webpack 的 vue-loader 事先把模板编译成 render 函数。

Compiler 过程分三步：

1.  parse： 解析 template 里面的内容，生成和 Vnode 对应的对象。按照模板的节点 和数据 生成对应的 ast（ast 这块不是很了解）。
2.  optimize： 遍历递归每一个 ast 节点，标记静态的节点（没有绑定任何动态数据），这样就知道那部分不会变化，于是在页面需要更新时，减少去比对这部分 DOM。（打 static 的标签）
3.  codegen： 将优化后的 ast，转成一个可以运行时执行的代码（描述数据节点）

在 Generate 完成后，生成的对象给到 render（vm.\_render）。 最终是通过执行 createElement 方法并返回的是 vnode，它是一个虚拟 Node。Vue 2.0 相比 Vue 1.0 最大的升级就是利用了 Virtual DOM。
