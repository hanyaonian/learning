# Mac settting up

## Find real JAVA_HOME

if you use `which java` or `where java`, you will keep getting `/usr/bin/java` or something like that.

```sh
# this get real java_home
/usr/libexec/java_home
```

## enhance your zsh

[oh my zsh](https://ohmyz.sh/#install)

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Husky not working

```sh
# disk access problem

chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## cmd config

- `~/.zshrc` => `zsh`
- `~/.bash_profile` => `bash`

... 有些时候某些有某个应用，另一个没有，可能是配置未对齐. 复制对应的配置并且执行 `source` 即可
