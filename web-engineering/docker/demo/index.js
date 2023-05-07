const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World from express in Docker!')
})

app.listen(port, () => {
  console.log(`Example app running in docker, on port ${port}`)
})