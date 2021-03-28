## 基础复习：[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

#### 常用的特殊字符

- **\\** 表示下一个非特殊字符的字符是特殊字符（组合）；表示下一个特殊字符不是特殊字符而是字符；在 string 中\是转译字符，因此还要再多一个

```js
// 这两个是同含义
new RegExp('[a-z]\\s', 'i');
/[a-z]\s/i;
```

- **^** 匹配输入开始
- **$** 匹配输入结束
- **\*** 匹配前一个表达式 0 次或者多次
- **+** 匹配前一个表达式一次或者多次
- **?** 匹配前一个表达式 0 次或者一次
- **.** 匹配除换行符以外的所有字符
- **[xyz]** 一个字符集合。匹配方括号中的任意字符，包括转义序列。你可以使用破折号（-）来指定一个字符范围。对于点（.）和星号（\*）这样的特殊符号在一个字符集中没有特殊的意义。他们不必进行转义，不过转义也是起作用的。

```js
/a-d/.test('c'); //false
/[a-d]/.test('c'); //true
/[!@#$%^&*()[\]]/; //各种特殊字符，etc...
```

- **[^xyz]** 一个反向字符集。也就是说， 它匹配任何没有包含在方括号中的字符。你可以使用破折号（-）来指定一个字符范围。任何普通字符在这里都是起作用的。

```js
'zxcvba'.match(/[^a-d]/g); // ["z", "x", "v"]
```

- **()** 匹配 'x' 并且记住匹配项。其中括号被称为捕获括号。示例见下：

```js
let someEmail = [
  'hanyaonian@qq.com',
  'hanyaonian@sysu.edu.cn',
  'hanyaonian@163.com'
];
// 注释此条不对，因为捕获符号和其他特殊符号没什么关系
// let emailReg = /^[a-zA-Z_\.1-9-]+@[a-zA-Z1-9]+(\.[a-zA-Z])+$/;
// 解析：
// 1. [a-zA-Z_\.1-9-]+@ 匹配各种用户名前缀，
// 2. 第一个括号匹配@后的域名内容，第二个括号匹配一个.[a-zA-Z] 特征的内容
// 3. 捕获到的元素可以在match中获得或通过 RegExp.$n 得到。$n 对应括号捕获顺序
let emailReg = /^[a-zA-Z_\.1-9-]+@([a-zA-Z1-9]+(\.[a-zA-Z]+)+)$/;
console.log(someEmail.map((email) => email.match(emailReg)[1]));
// ["qq.com", "sysu.edu.cn", "163.com"]
console.log(someEmail.map((email) => email.match(emailReg)[2]));
// [".com", ".cn", ".com"]
console.log(
  someEmail.map((email) => {
    email.match(emailReg);
    return [RegExp.$1, RegExp.$2];
  })
);
// ["qq.com", ".com"], ["sysu.edu.cn", ".cn"] ["163.com", ".com"]
```

- **|** 或符号。如 /green|red/匹配“green apple”中的‘green’和“red apple”中的‘red’
- **{n}** 表示前面的表达式出现了 n 次
- **{n, m}** 表示前面的表达式出现了 n 到 m 次
- **[\b]** 匹配一个退格
- **\d** 匹配一个数字; **\D** 匹配一个非数字
- **\w** 匹配一个单字字符（字母、数字或者下划线; **\W** 匹配一个非单字字符（[^a-za-z0-9_]）
- **\s** 匹配一个空白字符； **\S**匹配一个非空白字符。

其余平时接触较少的，不做记录。对常用的至少要有些印象，如果很简单的正则都完全想不起来实在太尴尬了。

#### 标志位

| 标志 | 描述                                                    |
| :--: | :------------------------------------------------------ |
|  g   | 全局搜索。                                              |
|  i   | 不区分大小写搜索。                                      |
|  m   | 多行搜索。                                              |
|  s   | 允许 . 匹配换行符。                                     |
|  u   | 使用 unicode 码的模式进行匹配。                         |
|  y   | 执行“粘性(sticky)”搜索,匹配从目标字符串的当前位置开始。 |

- **exec()** 一个在字符串中执行查找匹配的 RegExp 方法，它返回一个数组（未匹配到则返回 null）。
- **test()** 执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false。

```js
//遇到过一个问题，test完一次不可用了，后面发现是因为用了g标志位的原因，实际上用test不需要用到全局标志位
// 如果正则表达式设置了全局标志，test() 的执行会改变正则表达式   lastIndex属性。连续的执行test()方法，后续的执行将会从 lastIndex 处开始匹配字符串，(exec() 同样改变正则本身的 lastIndex属性值).
var regex = /foo/g;
// regex.lastIndex is at 0
regex.test('foo'); // true
// regex.lastIndex is now at 3
regex.test('foo'); // false
```

- **search()** 一个在字符串中测试匹配的 String 方法，它返回匹配到的位置索引，或者在失败时返回-1。
- **replace()** 一个在字符串中执行查找匹配的 String 方法，并且使用替换字符串替换掉匹配到的子字符串。。
