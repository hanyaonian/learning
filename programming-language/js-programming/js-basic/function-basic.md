# Function basic knowledge

## 目标

实现 Function Prototype 里面的 bind，apply，call

- 这里经常使用到...展开表达式剩余参数语法，
- es3 的展开表达式/剩余参数语法 会通过 apply 或者遍历 arguments 去做到的，
- 如果不使用展开表达式（剩余参数语法），实现这些方法会较麻烦

## this 解释

- <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this>
- 代码不在严格模式下，且 this 的值不是由该调用设置的，所以 this 的值默认指向全局对象
- 在严格模式下，如果进入执行环境时没有设置 this 的值，this 会保持为 undefined

1. 全局执行环境下，是全局上下文： window/global
2. 函数内部，this 的值取决于函数被调用的方式。
3. 当函数作为对象里的方法被调用时，this 被设置为调用该函数的对象。
4. 原型链中，如果该方法存在于一个对象的原型链上，那么 this 指向的是调用这个方法的对象。
5. 构造函数中，当一个函数用作构造函数时（使用 new 关键字），它的 this 被绑定到正在构造的新对象。虽然构造函数返回的默认值是 this 所指的那个对象，但它仍可以手动返回其他的对象（如果返回值不是一个对象，则返回 this 对象）。

   ```js
   function C() {
     this.a = 37;
     console.log(this);
   }
   const o = new C(); //作为构造函数 this: C {a: 37}
   C(); //函数内部 this: Window
   ```

6. 在类中，和函数类似；区别如下

   - 类的构造函数中，this 是一个常规对象。类中所有非静态的方法都会被添加到 this 的原型中
   - 静态方法不是 this 的属性，它们只是类自身的属性。

7. 派生类的构造函数没有初始的 this 绑定。在构造函数中调用 super() 会生成一个 this 绑定，并相当于执行如下代码，Base 为基类：

   ```js
   constructor() {
   super();
   // this为base类， this = new Base();
   }
   ```

8. 在箭头函数中，this 与封闭词法环境的 this 保持一致。

   ```js
   // 创建一个含有 bar 方法的 obj 对象，
   // bar 返回一个函数，
   // 这个函数返回 this，
   // 这个返回的函数是以箭头函数创建的，
   // 所以它的 this 被永久绑定到了它外层函数的 this。
   // bar 的值可以在调用中设置，这反过来又设置了返回函数的值。
   var obj = {
     bar: function () {
       var x = () => this;
       return x;
     },
   };
   // 作为对象方法直接调用，此时 bar 方法的环境的 this 是 obj 对象（条目 3）
   var fn = obj.bar();
   console.log(fn() === obj); // true
   // 但是注意，如果你只是引用 obj 的方法，
   // 而没有调用它
   var fn2 = obj.bar;
   // 那么调用箭头函数后，this 指向 window，因为它从 bar 继承了 this。
   console.log(fn2()() == window); // true
   ```

### call

```js
/**
 * call() 提供新的 this 值给当前调用的函数/方法。
 * 可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承此方法。
 * @param {*} context 上下文，当穿null或者undefined时，这个将是全局对象(window)
 * @param  {...any} args 传入方法的参数, 此处是es6写法；es3的话似乎也可以通过eval+字符串拼接的形式去写，见上
 *
 * call(thisArg, arg1, arg2, /* …, */, argN)
 */
Function.prototype.myCall = function (context, ...args) {
  if (this === Function.prototype) {
    return undefined;
  }
  if (!context) {
    context = window || global;
  }
  // 如果随意命名一个变量可能会覆盖掉原有的属性
  // 使用symbol (es6) 或者 random数字做一个key(es3)
  const funcSymbol = Symbol(Math.random());
  context[funcSymbol] = this;
  const result = context[funcSymbol](...args);
  delete context[funcSymbol];
  return result;
};
```

### apply

```js
/**
 * apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。
 * @param {*} context
 * @param {*} args 数组形式的参数列表
 *
 * apply(thisArg, argsArray)
 */
Function.prototype.myApply = function (context, args) {
  if (this === Function.prototype) {
    return undefined;
  }
  if (!context) {
    context = window || global;
  }
  // 同上
  let result;
  const funcSymbol = Symbol(Math.random());
  context[funcSymbol] = this;
  // es3 args.constructor === Array
  if (Array.isArray(args)) {
    result = context[funcSymbol](...args);
  } else {
    result = context[funcSymbol]();
  }
  delete context[funcSymbol];
  return result;
};
```

### bind

```js
/**
 * bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，
 * 而其余参数将作为新函数的参数，供调用时使用。
 * @param {*} context
 * @param {*} args 参数列表
 *
 * bind(thisArg, arg1, arg2, /* …, */ argN)
 */
Function.prototype.myApply = function (context, ...args1) {
  if (this === Function.prototype) {
    throw new TypeError("Error");
  }
  const that = this;
  // 还可以增加其他参数。
  return function F(...args2) {
    // 判断是否用于构造函数
    if (this instanceof F) {
      return new that(...args1, ...args2);
    }
    return that.apply(context, args1.concat(args2));
  };
};

/**
 * 不使用原有的call、bind 实现一个新的apply
 */
Function.prototype.noNativeApply = function (context, ...args1) {};
```
