// NOTE: this file will only ever be executed when in production, in development
// this file will not be executed, instead build/dev-server.js will be executed

const path = require('path');
const compression = require('compression');
const express = require('express');

const { UI_PORT } = process.env;

const app = express();

app.use(compression());

app.use('/static', express.static(path.join(__dirname, 'frontend', 'dist', 'static')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((req, res, next) => next(`Page not found ${req.url}`));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  if (req.json) {
    return res.json({ error: err });
  }

  return res.send(`Error: ${err.message || err}`);
});

app.listen(UI_PORT, () => console.log(`listening on port ${UI_PORT}`));
