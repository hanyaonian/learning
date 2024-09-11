# Mac settting up

## Find real JAVA_HOME

if you use `which java` or `where java`, you will keep getting `/usr/bin/java` or something like that.

```sh
# this get real java_home
/usr/libexec/java_home
```

## Terminal

### 1. install zsh

- [oh my zsh](https://ohmyz.sh/#install)

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

set zsh as default shell:

```sh
sudo sh -c "echo $(which zsh) >> /etc/shells"
chsh -s $(which zsh)
```

set bash as default shell:

```sh
chsh -s /bin/bash
```

### 2. Plugins

- zsh-autocomplete
- zsh-autosuggestions: [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)

1. download source

```sh
git clone https://github.com/marlonrichert/zsh-autocomplete.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autocomplete
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

2. add following content into oh-my-zsh configure file (~/.zshrc):

```r
# 1. remove all `compinit`

# 2. Add near the top, before any calls to `compdef`
source ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autocomplete/zsh-autocomplete.plugin.zsh

# 3. declare plugins
plugins=(
    # other plugins...
    zsh-autocomplete
    zsh-autosuggestions
)
```

3. start a new terminal session.

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
