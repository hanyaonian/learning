/**
 * 目标：实现Function Prototype里面的bind，apply，call
 * 
 * 这里经常使用到...展开表达式剩余参数语法，
 * 实际上es3的展开表达式都是通过apply或者遍历arguments去做到的，
 * 所以如果不使用展开表达式（剩余参数语法），很难实现这些方法
 */
/**
 * 首先要清晰，this究竟是什么？
 */

/**
 * call() 提供新的 this 值给当前调用的函数/方法。
 * 可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承此方法。
 * @param {*} context 上下文，当穿null或者undefined时，这个将是全局对象(window)
 * @param  {...any} args 传入方法的参数, 此处是es6写法；es3的话似乎也可以通过eval+字符串拼接的形式去写，见上
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
}

/**
 * apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。
 * @param {*} context 
 * @param {*} args 数组形式的参数列表
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
}

/**
 * bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，
 * 而其余参数将作为新函数的参数，供调用时使用。
 * @param {*} context 
 * @param {*} args 参数列表
 */
Function.prototype.myApply = function (context, ...args1) {
	if (this === Function.prototype) {
		throw new TypeError('Error')
	}
	const that = this
	// 还可以增加其他参数。
	return function F(...args2) {
		// 判断是否用于构造函数
		if (this instanceof F) {
			return new that(...args1, ...args2)
		}
		return that.apply(context, args1.concat(args2))
	}
}

/**
 * 不使用原有的call、bind 实现一个新的apply
 */
Function.prototype.noNativeApply = function (context, ...args1) {

 }