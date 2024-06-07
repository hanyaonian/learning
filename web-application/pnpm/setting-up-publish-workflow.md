# Monorepo publishing workflow

假设这个场景，一个pnpm项目中使用到了 `workspace` 进行包管理，几个包之间有互相依赖:

```text
+ packages
	+ packageA
	+ packageB
```

`packageA` 可能是一个比较基础的包，被 `packageB`引用:

```json
{
	"dependencies": {
		"packageA": "workspace:*", // or workspace:~, workspace:^ ...
	}
}
```

这种时候发布包需要用到 `pnpm publish -r`, 可以将全部包发布，并且将workspace的引用换成对应的远程包. 注: 像是根目录的`package.json`也会被识别, 这会将整个工程一并打包， 而这可能是你不愿意做的，这种时候需要在`package.json`中添加一个 `private: true`, 这样发布便会跳过这个包

使用 如下两个工具可以很好的解决包版本管理问题

- rush
- changesets

## Try rush

大致流程, 见https://pnpm.io/zh/using-changesets:

```sh
pnpm add -Dw @changesets/cli

pnpm changeset init

pnpm changeset

pnpm changeset version

pnpm install

pnpm publish -r
```