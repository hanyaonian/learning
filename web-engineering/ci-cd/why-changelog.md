# Why changelog

为什么工程中保持 changelog 的更新是件重要的事情.

参考链接:

- https://github.com/TrigenSoftware/simple-release/blob/main/GUIDE.md
- https://github.com/conventional-changelog/conventional-changelog

如果要保持主干内容整洁, 分支合入的时候通过 squash merge 也是一种方式.

## Example

在我的工作中, 习惯是 conventional commit + tapd trace (其他系统可能需要额外开发).

示例:

```sh
feat(tools): create schedule table --story=123456

fix(detail): post detail image pre-load --bug=123456
```

这样子生成的 log/commit 记录可以更好的追溯, 不同版本之间的 story/bug 也能很好的呈现.
