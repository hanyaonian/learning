# 常用 CMD

## 批量文件操作

有时会用到这种命令；但是一旦太多文件就会提示不ok

```sh
mv source_path/* target_path
cp source_path/* target_path/
```

可以通过`find`命令处理这个问题

```sh
# {} 是 find 命令找到的每个文件的占位符
# -f file 类型
# \; 表示 -exec 选项的结束。
find source_path -type -f -exec mv {} target_path/ \
```
