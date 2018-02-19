/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

require('./seedDb');

const http = require('http');
const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');

const log = require('./logger');
const router = require('./router');
const auth = require('./router/auth');

const { API_ROUTE_PREFIX, API_PORT } = process.env;

// show req/res .body in logs
expressWinston.requestWhitelist.push('body');

// log the response body
expressWinston.responseWhitelist.push('body');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable parsing of Authorization header
auth.init(app);

// log request/response
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
}));

// mount the api
app.use(API_ROUTE_PREFIX, router);

// catch no route matched --> 404
app.use((req, res, next) => next(new Error('Page not found')));

// handle errors
app.use((err, req, res, next) => {
  log.error(err);
  res.status(400).json(err.message || err);
});

const server = http.Server(app);

// start the server
server.listen(API_PORT, () => log.info(`listening on port ${API_PORT}`));
