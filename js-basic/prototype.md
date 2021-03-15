## 理解 JavaScript 原型与继承

今天第一次面试，很多知识点属于一知半解的状态，甚至只能乱猜答不出来。其中，原型这块以前是看过，但是却是一点也想不起来只能乱猜。那么现在来重新温习一下！

### 原型- prototype 简介(MDN)

Object.prototype 属性表示 Object 的原型对象。

几乎所有的 JavaScript 对象都是 Object 的实例；一个典型的对象继承了 Object.prototype 的属性（包括方法），尽管这些属性可能被遮蔽（亦称为覆盖）。但是有时候可能故意创建不具有典型原型链继承的对象，比如通过 Object.create(null)创建的对象，或者通过 Object.setPrototypeOf 方法改变原型链。

改变 Object 原型，会通过原型链改变所有对象；除非在原型链中进一步覆盖受这些变化影响的属性和方法。这提供了一个非常强大的、但有潜在危险的机制来覆盖或扩展对象行为。

#### 原型模式的几个要点（红书）

1. 每个函数都会创建一个 prototype 实例，prototype 是一个对象。这个就是通过调用构造函数创建的对象的原型。

```js
function A() {}
A.prototype.haha = function () {
  console.log('haha');
};
let a = new A();
a.haha();
```

2. 使用原型模式定义的属性和方法是由所有实例共享的.

```js
// 在1.的基础上加入代码
A.prototype.obj = { name: 'A' };
let a = new A();
let b = new A();
b.obj.name = 'B';
b.obj === a.obj; // true
console.log(a.obj); // { name: 'B' }
```

#### 理解原型

- 无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 prototype 属性（除了箭头函数，箭头函数没有 prototype, 箭头函数的 constructor 直接就是 Function 了）。
- 默认情况下，原型对象自动获得一个 constructor 属性，指向其关联的构造函数（循环引用）, 其他方法均继承自 Object。

```js
let p = new Person();
Person.prototype.constructor === Person; // true
p.constructor === Person; // true
p.constructor.prototype; // Person prototype上定义的实例和方法
p.constructor.prototype.constructor === Person; // true：prototype原型对象自动获得一个 constructor 属性，指向其关联的构造函数
```

- 每次调用构造函数创建一个实例，这个实例的内部 prototype 指针就会被赋值为构造函数的原型对象。但是实例上是访问不到的！chrome，Safari 可以通过 \_\_proto\_\_ 去访问到其构造函数的原型对象

```js
let a = new Person();
a.prototype; // undefined
a.__proto__ === Person.prototype; //true
a.__proto__.constructor === Person; // true, prototype原型对象自动获得一个 constructor 属性，指向其关联的构造函数，怕忘就多记一次
```

- 原型链终止于 Object 的原型对象，Object 的原型对象的原型对象是 null

```js
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true
Object.prototype; // bunch of Object methods & attrs

// ok, this is making me very confused.
Object.constructor === Function; // true;
Object.__proto__ === Function.__proto__; // true.
Function.prototype === Function.__proto__; // true. ends here. everything comes from function
```

- Object.getPrototypeOf 可以获取传入对象的原型对象（即构造函数的 prototype）
- isPrototypeOf() 可以确认对象之间的关系（也是看懵了）

```js
let b = new A();
Object.getPrototypeOf(b) === A.prototype; // true
A.prototype.isPrototypeOf(b); // true
```

- Object.setPrototypeOf(arg1, arg2). 这方法可以将 arg1 变为 arg2 对象的\[\[prototype\]\]写入新值.
- **important** 但是这个方法贼垃圾，红宝书上说用这个方法会导致严重性能影响
- 应该用 Object.create(arg)来创建对象与指定原型

```js
let b = new A();
let c = new A();
let d = {
  haha() {}
};
c.__proto__ === b; // true
Object.setPrototypeOf(c, d);
c.__proto__ === d; // true
```

#### 原型层级问题

- 给对象实例添加一个属性，这个属性就会**遮蔽**原型对象的同名属性，即不修改原型属性但屏蔽其访问
- hasOwnproperty 检查实例上的属性，不检查到原型链
- in 操作符可以访问到实例上或实例原型上的属性，并返回 true.

```js
function A() {}
A.prototype.haha = function () {
  console.log('haha');
};
let a = new A();
'haha' in a; // true
a.hasOwnProperty('haha'); // false
// 可以结合这两个特性，判断一个属性是否在原型链上
```

- Object.keys(obj) 枚举所有 obj 上的实例属性，不包括原型上的属性

### 继承
