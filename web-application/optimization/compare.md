# File Compare

大文件 -> 直接文件内存读入 = 爆炸;

stream + hash

```ts
function fileToHash(p: string) {
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    const stream = createReadStream(p);
    stream.on("data", (chunk: Buffer) => {
      hash.update(chunk);
    });
    stream.on("error", reject);
    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });
  });
}
```
