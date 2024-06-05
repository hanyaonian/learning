# pnpm monorepo project

inspired by `weifang`

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

Check the example, Now you have a basic monorepo project!

## Examples

check `boilerplate` under this directory. Including:

- husky (pre-commit, commitlint)
- lintstage (eslint, stylelint)
- code style (prettier, commitlint)

### step-by-step starting a team-first monorepo project Boilerplate

- IDE Setting

with `vscode`, here's the recommoned plugins and setting for teamwork. They are listed in `.vscode`.

in `plugins.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "wayou.vscode-todo-highlight",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "davidanson.vscode-markdownlint"
  ]
}
```

in `settings.json`:

```json
{
  "editor.rulers": [120],
  "explorer.openEditors.visible": 2,
  "files.eol": "\n",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.format.enable": true,
  "eslint.run": "onType",
  "eslint.enable": true,
  "eslint.options": {
    "configFile": "./**/.eslintrc.js"
  },
  // others...
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

- Git hooks & npm dependencies

```sh
# initializing pnpm
pnpm init
# naming project, description, etc.
# ...

# installing husky & hooks-related dependencies
pnpm add husky @commitlint/config-conventional @commitlint/cli -w -D

## preparing husky (git init needed)
pnpm pkg set scripts.prepare="husky install"
pnpm prepare

# add commit-msg hook: `pnpm exec` is same as `npx`
pnpm exec husky add .husky/commit-msg  'pnpm exec --no -- commitlint --edit ${1}'

# add pre-commit hook (for lint-stage)
# check eslint config for ts in "https://typescript-eslint.io/getting-started"
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
```

in `lint-stage`, you should add something like behind in package.json

```json
  "lint-staged": {
    "*.{js,ts}": "pnpm exec eslint --cache --fix"
  },
```

for `eslint` configs, check `https://typescript-eslint.io/linting/typed-linting/monorepos`
