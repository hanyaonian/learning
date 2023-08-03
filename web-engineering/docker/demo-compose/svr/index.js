const express = require('express')
const app = express()
const port = 3000

let count = 0;

app.get('/', (req, res) => {
  count += 1;
  res.send(`Hello World from express in Docker ${count} times!`)
})

app.listen(port, () => {
  console.log(`Example app running in docker, on port ${port}`)
})
