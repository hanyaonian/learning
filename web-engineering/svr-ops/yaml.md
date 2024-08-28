# YAML

- 通过缩进表示层次结构, 2/4 spaces;
- 通过冒号表示健值对 key-value; 空格分开;
- YAML 使用 [] 表示数组
- YAML 使用 {} 表示对象
- YAML 使用井号 & 表示引用, \* 表示使用引用
- YAML 使用井号（#）表示注释
- YAML 支持多种数据类型，如字符串、整数、浮点数、布尔值、日期和时间, Null(null, NULL, ~)

完整示例:

```yaml
anchor: &anchor_value This is an anchor value.
alias: *anchor_value

root:
  child: child_val
  # Map
  childs:
    - child1: child1_val
    - child2: child2_val
  # Object
  sub_child_obj: { name: sub_child_obj }

  # Array
  sub_child_list1: [1, 2, 3]
  sub_child_list2:
    - 1
    - 2
    - 2

  # Composite Array + map
  sub_child_composite_list1: [sub_child1: sub_child1_val]
  sub_child_composite_list2:
    - sub_child1: sub_child1_val

  # Anchor (Pointer)
  childobj: { name: child_obj, alias: *anchor_value }
```

equal to json:

```json
{
  "anchor": "This is an anchor value.",
  "alias": "This is an anchor value.",
  "root": {
    "child": "child_val",
    "childs": [
      {
        "child1": "child1_val"
      },
      {
        "child2": "child2_val"
      }
    ],
    "sub_child_obj": {
      "name": "sub_child_obj"
    },
    "sub_child_list1": [1, 2, 3],
    "sub_child_list2": [1, 2, 2],
    "sub_child_composite_list1": [
      {
        "sub_child1": "sub_child1_val"
      }
    ],
    "sub_child_composite_list2": [
      {
        "sub_child1": "sub_child1_val"
      }
    ],
    "childobj": {
      "name": "child_obj",
      "alias": "This is an anchor value."
    }
  }
}
```
