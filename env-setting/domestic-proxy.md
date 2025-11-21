# proxy for development

## Go

proxy:

- https://goproxy.cn/ proxy
- https://golang.google.cn/ 全站

```sh
# e.g download 1.25.4
wget -c https://golang.google.cn/dl/go1.25.4.linux-amd64.tar.gz
```

```sh
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

or

```sh
echo "export GO111MODULE=on" >> ~/.profile
echo "export GOPROXY=https://goproxy.cn" >> ~/.profile
source ~/.profile
```

## NPM Registry

- deprecated: `https://npm.taobao.org/mirrors/npm/`
- cuurent lts: `https://registry.npmmirror.com`

```sh
# cnpm alias
npm install -g cnpm --registry=https://registry.npmmirror.com
# or
alias cnpm="npm --registry=https://registry.npmmirror.com \ --cache=$HOME/.npm/.cache/cnpm \ --disturl=https://npmmirror.com/mirrors/node \ --userconfig=$HOME/.cnpmrc"
# or
npm config set registry https://registry.npmmirror.com
```
