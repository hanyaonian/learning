## Chapter 2 Javascript In HTML

#### <script>
- **async** 即刻下载脚本（仅外部），且不阻塞页面其他动作(如下载资源以及其他脚本加载)，**不保证加载执行顺序**
- **crossorigin** 默认不使用，‘anonymous’文件请求不必设置凭据标志，‘use-credentials’设置凭据标志，标示出站请求会包含
- **defer** 标示脚本（仅外部）延迟加载，文档完全被解析执行后再显示，**defer保证加载执行顺序，实际不一定**，run after domInteractive, before domContentLoaded
- **integrity** 签名比对，用于查看资源内容有无被更改，可用于校验cdn分发的文件有无被恶意篡改
- **type** type为module时才可以使用 export和import

- js文件按顺序加载，前面的解释完毕才能解释下一个（以前遇到的引用顺序问题）。
- css放在body前，js放在body后：老生常谈，不阻塞页面加载渲染了。
- 动态加载脚本：js插入 link rel=‘preload‘ href=’..js‘ 保证动态脚本的优先级


## Chapter 3 Some Basic Knowledge

###### 作用域
- let: 块作用域， var: 函数作用域你
- let不会被作用域提升，所以声明前的区域是’暂时性死区‘；全局作用域声明的let变量不会变成全局变量；let也不能依赖条件声明模式 

// 避免忘了symbol有点点特殊，btw Symbol用的实在实在太少了。。。
let s1 = Symbol('123');
let o = {
	[s1]: 123
}

