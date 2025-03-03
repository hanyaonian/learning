# NRM & NVM

## Lastest(2025-03): Volta

Volta’s job is to manage your JavaScript command-line tools, such as node, npm, yarn, or executables shipped as part of JavaScript packages.

see: https://volta.sh/

### Managing your toolchain

- Installing Node engines

```sh
# node
volta install node@22

# package managers...
volta install npm
volta install yarn

# remove
volta uninstall node@22
```

- Installing package binaries

```sh
# When you install a package to your toolchain,
# Volta takes your current default Node version and pins the tool to that engine
# see: https://docs.volta.sh/advanced/packages#pinned-node-version
yarn global add vuepress
```

### Managing your project

- Pinning Node engines

```sh
volta pin node@20.16
volta pin yarn@1.19
```

in `package.json`

```json
"volta": {
  "node": "20.16.0",
  "yarn": "1.19.2"
}
```

- Using project tools
- Safety and convenience (solves the problem of global packages)

## NRM

switch between different npm registries

see: https://github.com/Pana/nrm

## NVM

quickly install and use different versions of node via the command line

see: https://github.com/nvm-sh/nvm

### Downloading Node succeed but no nvm is installed

- error: Downloading npm version 10.2.4... Error while downloading `https://github.com/npm/cli/archive/v10.2.4.zip` ...

  - solution1: place correct package in C:\Users\xxx\AppData\Roaming\nvm\temp
  - solution2: nvm npm_mirror `https://registry.npmmirror.com/mirrors/` (any registry avalible)
