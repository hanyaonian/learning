- computed 的缓存是如何实现的？（缓存这个概念么怎么有听说过。）
  参考 huangyi 的 vue 技术原理揭秘：

1. 经历 initComputed 方法处理，initcomputed 对 computed 对象做遍历，拿到计算属性的每一个 userDef，然后尝试获取这个 userDef 对应的 getter 函数。
2. computed 中的属性，如果是响应式对象的话，它们的更新会触发 getter（在步骤 1 中会将 dep 添加到这个 watcher 中，dep.target 即是该 computed watch）。总结：一旦我们对计算属性依赖的数据做修改，则会触发 setter 过程，通知所有订阅它变化的 watcher 更新，执行 watcher.update() 方法。
3. computed watcher，它实际上是有 2 种模式，lazy 和 active。如果 this.dep.subs.length === 0 成立，则说明没有人去订阅这个 computed watcher 的变化，仅仅把 this.dirty = true，只有当下次再访问这个计算属性的时候才会重新求值。

- 总结：计算属性本质上是 computed watcher，而侦听属性本质上是 user watcher。就应用场景而言，计算属性适合用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。

关于 watcher：通常我们会在创建 user watcher 的时候配置 **deep** (递归遍历属性，对每个属性都增加监听操作)或者 **sync**（当响应式数据发送变化后，触发了 watcher.update()，只是把这个 watcher 推送到一个队列中，在 nextTick 后才会真正执行 watcher 的回调函数。而一旦我们设置了 sync，就可以在当前 Tick 中同步执行 watcher 的回调函数。）可以根据不同的场景做相应的配置。
