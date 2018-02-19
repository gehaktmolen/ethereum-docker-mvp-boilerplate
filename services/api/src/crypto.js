const { promisify } = require('util');

const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { BCRYPT_SALT_LENGTH } = process.env;

/**
 * will compare a given password with a given bcrypt hash
 *
 * @param {string} password - the password to check
 * @param {string} hash - the hash to compare the password to
 * @return {Promise.<boolean, error>} true if it matches, false otherwise
 */
exports.comparePassword = promisify(bcrypt.compare);

/**
 * will hash a given password
 *
 * @param {string} password - the password to hash
 * @return {Promise.<string, error>} the hash
 */
exports.hashPassword = _.partialRight(promisify(bcrypt.hash), +BCRYPT_SALT_LENGTH);
