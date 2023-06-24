## 理解 JavaScript 原型与继承

最近第一次面试，很多知识点属于一知半解的状态，只能乱猜答不出来。其中，原型这块以前是看过，但是可以说完全不熟悉了。面试题长这样：

```js
function A();
let a = new A();

a.__proto__ // A.prototype
A.__proto__ //？

Function.__proto__ //？
Object.__proto__ //？
A.prototype.__proto__ //？
Function.prototype.__proto__ //？
Object.prototype.__proto__ //？
```

ok, good. 日常工作中完全没使用过。回忆一下，关于这块我懂什么呢？

- 对象上没有的属性回到原型链上去找
- 原型方法实例可以用
- 。。。其他不知道了

那么现在来重新温习一下！

### 原型- prototype 简介(MDN)

Object.prototype 属性表示 Object 的原型对象。

几乎所有的 JavaScript 对象都是 Object 的实例；一个典型的对象继承了 Object.prototype 的属性（包括方法），尽管这些属性可能被遮蔽（亦称为覆盖）。但是有时候可能故意创建不具有典型原型链继承的对象，比如通过 Object.create(null)创建的对象，或者通过 Object.setPrototypeOf 方法改变原型链。

改变 Object 原型，会通过原型链改变所有对象；除非在原型链中进一步覆盖受这些变化影响的属性和方法。这提供了一个非常强大的、但有潜在危险的机制来覆盖或扩展对象行为。

#### 原型模式（红书）

1. 每个函数都会创建一个 prototype 实例，prototype 是一个对象，是通过调用构造函数创建的对象的原型。

```js
function A() {}
A.prototype.haha = function () {
  console.log('haha');
};
let a = new A();
a.haha(); //实例调用原型方法
```

2. 使用原型模式定义的属性和方法是由所有实例共享的.

```js
// 在1.的基础上加入代码
// 增加原型属性obj，prototype上的是原型属性，大伙共享
A.prototype.obj = { name: 'A' };
let a = new A();
let b = new A();
b.obj === a.obj; // true
b.obj.name = 'B';
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

- Object.setPrototypeOf(arg1, arg2). 这方法可以将 arg1 变为 arg2 对象的 prototype 指针写入新值.
- **important！：** 但是这个方法贼垃圾，红宝书上说用这个方法会导致严重性能影响
- 应该用 Object.create(arg)来创建对象与指定原型
  关于 Object.setPrototypeOf(arg1, arg2)的 demo 代码如下

```js
let b = new A();
let c = new A();
let d = {
  haha() {}
};
c.__proto__ === b.__proto__; // true
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

- Object.keys(obj) 枚举所有 obj 上的实例属性，不包括原型上的属性。

## 继承

继承，主要是通过原型链实现的。下面看看继承的主要方式。

### 一.原型链继承

如果一个构造函数的原型，是另一个类型的实例，那么该构造函数的原型本身有个内部指针指向另一个原型，另一个原型也有一个指针指向另一个构造函数，这样实例和原型之间构造了一条原型链。

1. 原型链 demo：

```js
function dad() {}
dad.prototype.name = 'dad';
dad.prototype.sayHi = function () {
  console.log(this.name);
};
function son() {}
// 构造原型链
son.prototype = new dad();
son.prototype.sonName = 'Son';
son.prototype.sonHi = function () {
  console.log(this.sonName);
};
let d = new dad();
let s = new son();
s.sayHi(); // dad，继承dad的方法
s.sonHi(); // son，自己的实例方法
d.sayHi(); // dad
//dad.sonHi(); //error: sonHi not a function
```

2. 实现的关键在于，子类没有使用默认原型，而是使用了父类的实例，这样一来不仅可以获取到父类的属性和方法，也能和父类的原型挂上钩。即使说，读取实例属性时，如果没有在找到该属性，就会在其原型上搜索，
3. 默认原型：所有的引用类型都继承自 Object
4. 原型与实例的关系可以通过以下两种方法确定：
   - instanceof (原型链中是否包含构造函数的原型, right-handside 得是 callable 的构造函数)
   - isPrototypeOf(), 原型链中的每一个原型都可以调用此方法
   ```js
   s instance of dad; // true
   s instance of Object; // true
   dad.prototype.isPrototypeOf(s); // true
   // ...
   ```
5. 原型链中属性/方法都是所有实例共享的，所以属性一般都在构造函数中定义（这样就是实例中属性）。但通过原型链继承，用于继承的实例的实例属性会变成子类的原型属性，并且在子类的所有实例中共享。那么，还是要在子类型的构造函数里重新定义实例属性。

```js
function dad() {}
dad.prototype.obj = {
  name: 'dad'
};
dad.prototype.sayHi = function () {
  console.log(this.obj);
};
function son() {}
// 构造原型链
son.prototype = new dad();
let s1 = new son();
let s2 = new son();
s1.obj.name = 'step-dad';
console.log(s2.obj); // { name: 'step-dad' }
```

### 二. 盗用构造函数（对象伪装/经典继承）

这种方式很简单，可以解决原型包含引用值引发的继承问题。这样，可以继承到父类上的实例属性。
问题在于，无法继承父类的原型上定义的方法和属性。

```js
// 定义父类的实例属性
function superClass() {
  this.obj = { name: 'dad' };
}
// 定义父类的原型属性与原型方法
superClass.prototype.method = function () {
  console.log('super method');
};
superClass.prototype.stuff = { name: 'prototype stuff' };
function sub() {
  superClass.call(this);
  // 等于在son的上下文里执行了 this.obj = {}...
  // 这里的obj会是新的属于son的船新的实例属性，实例属性哦
}
let s1 = new sub();
let s2 = new sub();
let super1 = new superClass();
s1.obj.name = 'sub1';
console.log(s1.obj === s2.obj, s2.obj === super1.obj);
// false false
console.log(s1.obj, s2.obj, super1.obj);
// sub1, dad, dad
console.log(s1.method, s1.stuff);
// undefined undefined
```

### 三. 组合继承（伪经典继承）

即是 2、3 两种方式的组合。既通过原型链继承原型上的方法，也通过经典继承/盗用构造函数去继承实例属性和方法。

```js
// 上一段盗用构造函数的demo代码中加上：
sub.prototype = new superClass();
let s2 = new sub();
console.log(s2.method, s2.stuff);
// good! 这样都可以访问到了，实例属性也有！
```

### 四. 原型式继承

详见方法 Object.create();

### 五. 寄生式继承

知其概念即可，相当于先实现一个继承函数，然后再加强/定制对象，然后再返回对象。

```js
function createObj(origin) {
  // 浅拷贝
  let clone = object(origin);
  clone.addedMethod = function () {
    console.log('special method');
  };
  return clone;
}
```

### 六. 寄生式组合继承（这个没理解，书本 8.3.6）

寄生式组合继承是引用类型继承的最佳模式。
通过盗用构造函数继承属性，但使用混合式原型链继承方法。->寄生式继承来继承父类原型，返回新对象赋值给子类原型。

```js
function inheritPrototype(sub, sup) {
  let prototype = object(sup.prototype); //创建对象
  // 重写原型会导致constructor丢失，重新指回去
  prototype.constructor = sub;
  sub.prototype = prototype;
}
```

#### 回过头再看面试题(原型链相关)

温习完红宝书了，那么该看一看面试题的答案自己现在能不能写出来了：

```js
function A();
let a = new A();

a.__proto__ // A.prototype
A.__proto__ // Function.prototype, 是Object

Function.__proto__ // Function.prototype, Function instanceof Function -> true
Object.__proto__ // Function.prototype， Object instanceof Function -> true
A.prototype.__proto__ //  Object.prototype
Function.prototype.__proto__ // Object.prototype
Object.prototype.__proto__   // null
```

5, 6 仔细再想一想可以理解：
A.prototype.\_\_proto\_\_ 解析一下：A.prototype 是一个 Object，上面没有了，所以 A.prototype 的\_\_proto\_\_是 Object.prototype（构造函数的 prototype）
Function.prototype.\_\_proto\_\_, 同理，Function.prototype 是个 object，再往上也没有了。

#### 好的，也没有白复习，起码从一头雾水到知道一部分了。。。希望对面试的小伙伴们有帮助！
