# proxy for development

## Go

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