# Proxy

## DefineProperty

参考文档： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

```js
const object1 = {};

// Object.defineProperty(obj, prop, descriptor);
Object.defineProperty(object1, "property1", {
  value: 42,
  writable: false,
});

// Throws an error in strict mode
object1.property1 = 77;

// Expected output: 42
console.log(object1.property1);

// if has value or writable, will throw error Cannot both specify accessors and a value or writable attribute
const object2 = {};
Object.defineProperty(object2, "property2", {
  get() {
    return this.value * 2;
  },
  set(val) {
    this.value = val;
  },
});

object2.property2 = 1;
console.log(object2.property2); // 2
```

- 缺陷

```js
let list = [1];

list.map((elem, index) => {
  Object.defineProperty(list, index, {
    get: function () {
      console.log("get index:" + index);
      return elem;
    },
    set: function (val) {
      console.log("set index:" + index);
      elem = val;
    },
  });
});

list[0] = 1; // "set index: 0"
console.log(list[0]); // "get index:0" 1
list.push(2); // 无输出
list[1] = 2; // 无输出
console.log(list[1]); // 2
list.length = 10; // 无输出
```

Vue2 通过 Object.defineProperty 实现， 在劫持对象和数组时存在缺陷, 存在性能问题或者需要 hack：

- 无法检测到对象属性的添加或删除
- 监听对象的多个属性，需要遍历该对象 (性能问题)
- 无法检测数组元素的变化，需要进行数组方法的重写
- 无法检测数组的长度的修改

## ES6 - Proxy

```js
let o = {};
let value = "value";

// 使用 Proxy 创建 对象 o 的代理对象 p
let p = new Proxy(o, {
  get(target, property) {
    // 获取对象 o 上的属性，有则返回该属性的值，如果没有则返回变量 value
    return property in target ? target[property] : value;
  },
  set(target, property, value) {
    // 设置对象 p 的 value
    target[property] = value;
    return true;
  },
  deleteProperty: function (target, propKey) {
    // 删除对象 p 上的属性
    console.log(`delete ${propKey}!`);
    delete target[propKey];
    return true;
  },
});

// 获取对象 p 的属性 value 的 value
console.log(p.value); // "value"; proxy的默认返回值

// 设置对象 p 的属性 b 的值为 value1
p.b = "value1"; // "value1"
console.log(p.b); // "value1"

// 对象 o 的方法也被改变了
console.log(o.value); // undefined, 原对象无此属性
console.log(o.b); // "value1"

delete p.b; // "delete b!"
console.log(o.b); // "undefined"
```

Proxy 可以代理数组等复杂对象

```js
let numbers = [];

let p = new Proxy(numbers, {
  set(target, key, val) {
    // 拦截写入属性操作
    if (typeof val == "number" && val % 2 === 0) {
      target[key] = val;
      return true;
    } else {
      // if false, Error: 'set' on proxy: trap returned falsish for property '0'
      return true;
    }
  },
  get(target, key) {
    console.log(this === numbers);
    console.log(`get ${key}: ${target[key]}`);
    return target[key];
  },
});

p.push(1);
// get push: function push() { [native code] }
// get length: 0

p.push(2); // 成功
// get push: function push() { [native code] }
// get length: 1
console.log("Length is: " + p.length, numbers.length); // Length is: 1, 1
```

- `This` issue

```js
let target = {
  m() {
    // 检查 this 的指向是不是 proxyObj
    console.log(this === proxyObj);
  },
};
let handler = {};
let proxyObj = new Proxy(target, handler);

proxyObj.m(); // 输出: true
target.m(); //输出: false
```
