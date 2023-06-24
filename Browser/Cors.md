# CROS 功能概述

跨源资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request）(204 OPTION 请求)，从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。

## 简单请求

某些请求不会触发 CORS 预检请求。本文称这样的请求为“简单请求”，请注意，该术语并不属于 Fetch （其中定义了 CORS）规范。若请求满足**所有下述条件**，则该请求可视为“简单请求”：
使用下列方法之一：

- GET
- HEAD
- POST

除了被用户代理自动设置的首部字段（例如 Connection ，User-Agent）和在 Fetch 规范中定义为 禁用首部名称 的其他首部，允许人为设置的字段为 Fetch 规范定义的 对 CORS 安全的首部字段集合。该集合为：

- Accept
- Accept-Language
- Content-Language
- Content-Type （需要注意额外的限制）
- DPR
- Downlink
- Save-Data
- Viewport-Width
- Width

Content-Type 的值仅限于下列三者之一：

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。
请求中没有使用 ReadableStream 对象。

## 过往开发遇到的问题

在做博客的验证码功能时，是想通过 header 把验证码相关的信息扔回来，但是却无法访问到对应的 header，why?
默认情况下，只显示 6 个简单的响应标头：

- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

如果要访问其他的头部信息，需要设置 Access-Control-Expose-Headers

## 工作中常见的问题：如果外包面试不明白cors的概念也不必通过

- 同源 iframe 现在也不可以操作 iframe 里的元素了；可以获取到 webcontent，但是不可以读 document 等。 2021-9-13
- 非同源的iframe等内容，可以通过 `postMessage` 的方法去做类似 rpc 的调用.
