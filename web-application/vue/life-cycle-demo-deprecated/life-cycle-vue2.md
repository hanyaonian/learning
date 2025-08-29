# Vue2 父子组件 life hook 调用顺序、时机

从 demo 中可以看到，创建的 life hook 调用顺序是：
父 created -> 子 created
子 mounted -> 父 mounted

更新视图时：
如果不涉及父组件，那么父组件是不会更新视图的，只会触发子组件的 update 生命周期
如果设计父组件的更新，那么顺序会是

```txt
father before update
child before update
child update
father update
```

比较好记的话是更新视图从子开始，数据相关的 hook 则是父组件开始。
