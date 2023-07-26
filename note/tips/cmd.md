# Regular cmd usage in development

## killing a process by port

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
