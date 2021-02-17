## Chapter 5 基础数据类型

#### 原始值包装类型
- 3种特殊引用类型，用于方便原始值操作：Boolean，Number，String。
- 读模式访问以上的类型时，会经历以下三步：
	1. 创建一个同类型的实例
	2. 调用实例上的方法
	3. 销毁实例
	````js
	let s1 = 'haha';
	let s2 = s1.subString(2);
	// 等同于以下三步：
	let s1 = new String('haha')
	let s2 = s1.subString(2);
	s1 = null;
	````
- 这意味着不能运行时给原始值添加属性和方法。