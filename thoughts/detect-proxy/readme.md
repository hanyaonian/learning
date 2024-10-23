# How to detect proxy?

在公司里, 经常挂着 proxy omega/whistle; 使用了代理插件就没有办法愉快的刷内网资源/stackoverflow 了, 因为会被识别到代理, 服务端是怎么做到检测的呢？做个实验验证一下想法

## 实验

### 1 - install proxy omega

- https://github.com/FelisCatus/SwitchyOmega/releases
- for edge: https://microsoftedge.microsoft.com/addons/detail/proxy-switchyomega/fdbloeknjpnloaggplaobopplkdhnikc

### 2 - start simple express server

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  const headers = Object.keys(req.headers);
  console.log(headers, headers.length);
  res.send("Hello World");
  res.end();
});

app.listen(3000);
```

### 3 - setting proxy

setting proxy name in `whistle`

```conf
https://test.host.com localhost:3000
```

reach server from 'localhost:3000' and 'https://test.host.com' respectly.

check the header results;

### 4 - result

```ts
// headers from proxy
[
  "host",
  "cache-control",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "upgrade-insecure-requests",
  "user-agent",
  "accept",
  "sec-fetch-site",
  "sec-fetch-mode",
  "sec-fetch-user",
  "sec-fetch-dest",
  "accept-encoding",
  "accept-language",
  "if-none-match",
  "priority",
  "connection",
];

// header missing from direct request
["priority", "connection"];
```

### 5 - CONCLUSION

头部有细微差异; 除此之外, 其他站点可以通过添加签名的方式，判断是否有篡改头部或者 body 内容吧; stackoverflow 的一些响应体 看着就挺象签名的
