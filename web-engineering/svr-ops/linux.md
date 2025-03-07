# 接触的 linux 命令

| 命令                                       | 解释                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------- |
| lsof -i:\<port\>                           | 检查端口占用.                                                         |
| kill \<pid\>                               | 根据 pid 杀死进程，有选项                                             |
| unzip \<file\> -d \<dst\>                  | 解压 zip 文件到相应位置                                               |
| ssh <username>@<IP address or domain name> | ssh 连接                                                              |
| logout                                     | ssh 断开                                                              |
| cp/mv \<file\> \<dst\>                     | 复制、移动(重命名) file -> dst                                        |
| vmstat 1 5                                 | 每秒采集一次 cpu 使用率，采集 5 次                                    |
| ll                                         | ls 升级版本 可以看到更新时间                                          |
| tail -f                                    | 查看文件末尾，看日志比较方便                                          |
| grep "xx" filename                         | grep 日志, 必备, 不提了。。。                                         |
| chomd xxxx                                 | 设置文件权限; see: https://www.runoob.com/linux/linux-comm-chmod.html |

## 查看机器版本相关信息

```sh
# 查看 64 位 还是 32 位
getconf LONG_BIT # 64 / 32

# 查看是 arm/amd/...
dpkg --print-architecture
# amd64...
```
