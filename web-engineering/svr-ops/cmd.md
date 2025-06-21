# 常用 CMD

很多命令都可以通过 ai 去做了

## 查询

`grep`, `which`, `ps`, `where`, `find`

## 批量文件操作

有时会用到这种命令；但是一旦太多文件就会提示不 ok

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

## 压缩

```txt
tar [-ABcdgGhiklmMoOpPrRsStuUvwWxzZ][-b <区块数目>][-C <目的目录>][-f <备份文件>][-F <Script文件>][-K <文件>][-L <媒体容量>][-N <日期时间>][-T <范本文件>][-V <卷册名称>][-X <范本文件>][-<设备编号><存储密度>][--after-date=<日期时间>][--atime-preserve][--backuup=<备份方式>][--checkpoint][--concatenate][--confirmation][--delete][--exclude=<范本样式>][--force-local][--group=<群组名称>][--help][--ignore-failed-read][--new-volume-script=<Script文件>][--newer-mtime][--no-recursion][--null][--numeric-owner][--owner=<用户名称>][--posix][--erve][--preserve-order][--preserve-permissions][--record-size=<区块数目>][--recursive-unlink][--remove-files][--rsh-command=<执行指令>][--same-owner][--suffix=<备份字尾字符串>][--totals][--use-compress-program=<执行指令>][--version][--volno-file=<编号文件>][文件或目录...]
```

常用:

- -c 创建归档
- -x 解压归档
- -f 归档文件名称
- -v 显示输出，列出操作的文件列表
- -t 列出归档文件中的文件列表
- -z 使用 gzip 压缩

e.g

```sh
# 解压 gzip tar
tar -zxvf example.tar.gz
# 压缩
tar -zcvf archive.tar.gz ./
```

## 根据端口做掉进程 killing a process by port

example port is `8080`, example pid is `1234`

- windows

```sh
# get all port status
netstat -ano

# query port status with keyword '8080'
netstat -ano | findstr "8080"

# you may find port info like:
# TCP    xxx.xxx.xxx.xxx:xxx   xxx.xxx.xxx.xxx:8080     ESTABLISHED     1234
# the last output is pid, for example 1234

# get running task
tasklist

# get running task with target pid as keyword
tasklist | findstr "1234"

# you may find task info like:
# node.exe   1234   Console   1    248,120 K

# kill the task, with F means force
taskkill /pid 1234 /f
```

- mac

mac is much easier

```sh
# list the pid using port 8080
lsof -i:8000

# kill/reload/terminate the process
# -1 reload, -9 kill, -15 terminate
kill -9 1234
```
