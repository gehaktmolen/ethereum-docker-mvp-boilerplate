const mongoose = require('mongoose');
const log = require('../logger');

const { MONGO_URL } = process.env;

mongoose.Promise = Promise;

mongoose.connect(MONGO_URL, { useMongoClient: true });

mongoose.connection.on('error', err => log.error(err));

mongoose.connection.once('open', () => {
  log.info('✓ Connected to MongoDB');
});

module.exports = mongoose;
