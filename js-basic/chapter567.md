# Chapter 5 基础数据类型

数据类型复习

## 原始值包装类型

- 3 种特殊引用类型，用于方便原始值操作：Boolean，Number，String。
- 读模式访问以上的类型时，会经历以下三步：

  1. 创建一个同类型的实例
  2. 调用实例上的方法
  3. 销毁实例

  ```js
  let s1 = 'haha';
  let s2 = s1.subString(2);
  // 等同于以下三步：
  let s1 = new String('haha');
  let s2 = s1.subString(2);
  s1 = null;
  ```

- 这意味着不能运行时给原始值添加属性和方法。

## 456 章节相关面试题

- 说出六种以上判断变量类型的方式

  1: typeof

  ```text
  "undefined" --- 如果这个值未定义
  "string" --- 如果这个值是字符串
  "boolean" --- 如果这个值是布尔类型值
  "number" --- 如果这个值是数值
  "object" --- 如果这个值是对象或者 null(typeof null 是object)
  "function" --- 如果这个值是函数
  "symbol" --- 如果是symbol
  ```

  2: instanceof 检测不了基本类型
  3: 通过变量的 construct 进行判断

  ```js
  let a = Symbol(1);
  a.constructor === Symbol; //true
  ```

  4: Object.prototype.toString.call(), 输出 "[object Object]"之类的，可以检测基本类型

  ```text
  注意往数组/对象里用莫名其妙的东西做key的时候(不包含null)，都会把这个东西tostring了再做key，实际上就是a['object Object']之类的了
  ```

  5: 各类原型方法，如 Array.isArray()，Object.is()等等
  6: 通过 prototype 判断是谁的子集
