# Private member initialization

见: `./private-member.ts`

`private name = ""` 等价于

```ts
constructor () {
  this.name = "";
}
```
