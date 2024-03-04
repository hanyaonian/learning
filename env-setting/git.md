## require "Enter passphrase for key"

- check ssh-agent

```sh
eval "$(ssh-agent -s)" 
```

- add ssh-key to ssh-agent

```sh
# id_rsa or anything
ssh-add ~/.ssh/id_xxx

chmod ~/.ssh/id_xxx
```
