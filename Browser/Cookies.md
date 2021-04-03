## Cookies 学习笔记(MDN)

#### Cookie 的作用域

Domain 和 Path 标识定义了 Cookie 的作用域：即允许 Cookie 应该发送给哪些 URL。

- Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为 origin，不包含子域名。如果指定了 Domain，则一般包含子域名。因此，指定 Domain 比省略它的限制要少。但是，当子域需要共享有关用户的信息时，这可能会有所帮助。

- Path 标识指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 %x2F ("/") 作为路径分隔符，子路径也会被匹配。

**SameSite**
SameSite Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，（其中 Site 由可注册域定义），从而可以阻止跨站请求伪造攻击（CSRF）。

- None。浏览器会在同站请求、跨站请求下继续发送 cookies，不区分大小写。
- Strict。浏览器将只在访问相同站点时发送 cookie。（在原有 Cookies 的限制条件上的加强，如上文 “Cookie 的作用域” 所述）
- Lax。与 Strict 类似，但用户从外部站点导航至 URL 时（例如通过链接）除外。 在新版本浏览器中，为默认选项，Same-site cookies 将会为一些跨站子请求保留，如图片加载或者 frames 的调用，但只有当用户从外部站点导航到 URL 时才会发送。

#### Cookies 的安全性

> - 信息被存在 Cookie 中时，需要明白 cookie 的值时可以被访问，且可以被终端用户所修改的。
> - 根据应用程序的不同，可能需要使用服务器查找的不透明标识符，或者研究诸如 JSON Web Tokens 之类的替代身份验证/机密机制。

缓解涉及 Cookie 的攻击的方法：

- 使用 **HttpOnly** 属性可防止通过 JavaScript 访问 cookie 值。
- 用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短，并且 SameSite 属性设置为 Strict 或 Lax。（请参见上方的 SameSite Cookie。）在支持 SameSite 的浏览器中，这样做的作用是确保不与跨域请求一起发送身份验证 cookie，因此，这种请求实际上不会向应用服务器进行身份验证。

通过 Document.cookie 属性可创建新的 Cookie，也可通过该属性访问非 HttpOnly 标记的 Cookie。

```js
document.cookie = 'yummy_cookie=choco';
document.cookie = 'tasty_cookie=strawberry';
console.log(document.cookie);
// logs "yummy_cookie=choco; tasty_cookie=strawberry"
```
