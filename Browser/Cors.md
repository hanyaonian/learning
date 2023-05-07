# 基本概念, 如果外包不明白cors的概念也不必通过

- 同源 iframe 现在也不可以操作 iframe 里的元素了；可以获取到 webcontent，但是不可以读 document 等。 2021-9-13
- 非同源的iframe等内容，可以通过 `postMessage` 的方法去做类似 rpc 的调用.
