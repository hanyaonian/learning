# common use of shell

## use variable

```sh
for file in `ls /etc`
# or
for file in $(ls /etc)

your_name="qinjx"
echo $your_name
# or
echo ${your_name}
```

## file/string test

- `-a filename`: is file exist
- `-f filename`: is afile
- `-d filename`: is directory
- `-L filename`: is file a Symbolic link
- `-e filename`: same as -a
- `-r filename`: is file readable
- `-w filename`: is file writable
- `-x filename`: is file excutable
- `-s filename`: is file null (bigger than 0)
- `-n string`: is string not null

sample

```sh
if [ -n "shit" ]; then
  echo "string not empty"
fi
```

## use function & arguments

$1 is the first command-line argument passed to the shell script. Also, know as Positional parameters. For example, $0, $1, $3, $4 and so on. If you run ./script.sh filename1 dir1, then:

- $0 is the name of the script itself (script.sh)
- $1 is the first argument (filename1)
- $2 is the second argument (dir1)
- $9 is the ninth argument
- ${10} is the tenth argument and must be enclosed in brackets after $9.

example

```sh
function some_recursive_trans() {
  for file in "$1"/*; do
    if [ -d "$file" ]; then
      some_recursive_trans "$file"
    elif [ -f "$file" ]; then
      echo "trans $file"
    fi
  done
}

# if [ -ne $1 ]
if [ $# -ne 1 ]; then
  echo "Missing arguments. Usage: $0 <diretory>"
  exit 1
fi

some_recursive_trans "$1"

# sh ./test.sh .
```

## tips

### check command

```sh
command -v sh
# /bin/sh
```
