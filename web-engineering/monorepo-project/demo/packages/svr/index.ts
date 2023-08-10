import express from 'express';
import config from 'config';

let counter = 0;
const app = express();

app.get('*', (_req, res) => {
  res.end(`count ${counter++} times`);
});

app.listen(config.SERVER_PORT, () => {
  console.log(`listen on port ${config.SERVER_PORT}`);
});
