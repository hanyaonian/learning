# pnpm monorepo project

Rencently I have joined a project that use `pnpm` and gained some practical experience about it.

It solve some problem effectively. Here, I would document some notes and have basic implementation example.

## Pre-requisite

- node.js >= 16.14
- [Intallation](https://pnpm.io/installation)

## Starting a pnpm project demo

### init

- in project root dir, run

```sh
pnpm init
```

a `package.json` is created, just like `npm` or `yarn`. let's try install a package.

### create workspace

create a file `pnpm-workspace.yaml`, here's an example:

```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of components/
  - 'components/**'
  # exclude packages that are inside test directories
  - '!**/test/**'

```

### add a package

```sh
pnpm add vite -D

# ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the workspace root, which might not be what you want - if you really meant it, make it explicit by running this command again with the -w flag (or --workspace-root). If you don't want to see this warning anymore, you may set the ignore-workspace-root-check setting to true.
```

```sh
# with -w, means install in workspace root
# this is for some packages are used in whole project, like eslint
pnpm add eslint -w
```

### create a sub project

here, we will create a simple sub-project, which use node.js to play as server.

```sh
# create packages dir;
mkdir packages

mkdir packages/svr

cd packages/svr

# the package name would be 'svr', follow the dir name
pnpm init

# in 'packages/svr', add a package
pnpm add express

# see https://pnpm.io/filtering
# or, in workspace root diretory
pnpm --filter svr add express
```

likewise, we create `config` and `web`, holding configure and web content repectively.

### collaborate project in workspace

check the example in `./package.json`

- [parallel](https://pnpm.io/cli/run#--parallel)
- [workspace](https://pnpm.io/workspaces)
