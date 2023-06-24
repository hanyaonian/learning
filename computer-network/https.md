# things about https

## HTTPS 是什么

https和HTTP一样是网络传输协议，属于应用层的内容。https的内容在传输过程中会通过对称加密对数据进行加密，保护了数据的安全性。一般是443端口。
https基于ssl/tsl（SSL（安全套接字）与TLS（运输层安全）都属于运输层协议）

## 为什么需要https？

http是明文传输。如果通过http传输数据，在能够获取网络数据包的情况下，攻击者可以查看(破坏data confidentiality)、修改(破坏data integrity)、伪造数据.

## HTTP容易遭受的攻击

- 内容窃取，用户的敏感信息被捕获
- 内容篡改，用户传输的数据、网页的表单被加入恶意数据
- 中间人攻击。双方传输的数据，都被中间的攻击者劫持并且篡改/查看后发出，而双方都没有意识到数据传输过程中有恶意攻击者。

## HTTPS的基础

- 非对称加密。特点是有两个密钥，公钥和私钥：公钥加密的内容只有私钥能解，反之亦然。
- 对称加密。有密钥和算法就可以获取到内容。流式处理，CBC啥的，大致忘了。

## HTTPS的过程

- 客户端向服务端发送client hello 信息。其中会包含

 1. SSL or TLS version
 2. Cryptographic algorithms list（客户端支持的加密算法）
 3. data compression methods supported by the clien

- 服务端收到之后，会返回server hello信息，其中会包含：

 1. Cryptographic algorithms agreement（双方可用的加密算法）
 2. session id（对话id）
 3. server digital certificate（带CA签名）
 4. public key

- 客户端验证服务端的数字证书（digital certificate），向谁认证呢？CA（certificate authority）证书颁发机构。正常来说浏览器/系统会预装一些权威机构的认证，一下就完成了认证，确定这个服务端是可信的。

- clientKey exchange。客户端将一个secret key(对称加密的密钥)发送给服务端，通过服务端的公钥，这样只有服务端能解密获取。
- 客户端发送一个finish 信息给到服务端，通过客户端发送的密钥进行加密（使用前面商量好的对称加密算法进行加密），表达客户端的handshake已完成，美更多内容了。
- 服务端也返回一个finish，也是同样的对称算法+密钥。表明服务端的handshake部分已完成

以上就是SSL/TLS hanshake的过程。

## HTTPS避免攻击的问题？

- 双方交换密钥的过程中，可以有中间人吗？例如中间人篡改公钥，让客户端用中间人的公钥去发送内容，中间人解密后再换自己的内容去和服务端交互.
中间人无法篡改这些内容，因为在服务端返回的数字证书上，会有CA的数字签名，攻击者无法修改内部的内容（签名保证了数据的integrity，篡改内容签名回不正确。）

- 什么情况下HTTPS还会被（中间人）攻击

 1. 服务端的证书私钥被窃取，ssl/tls建立过程中的内容被中间人知悉，那么内容不安全。
 2. 服务端的证书颁发的高层级CA是野鸡机构，给攻击者也颁发了证书，然后这个攻击者可以实施中间人攻击，因为客户端会认为他的证书是可信任的。正常不会有这种情况，因为顶级CA都是可信的（CA分层级）。
