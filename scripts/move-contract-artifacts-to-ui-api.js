/* eslint-disable no-case-declarations */

const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const copyDir = require('copy-dir');

const srcPath = path.join(__dirname, '..', 'services', 'smart-contracts', 'src', 'build', 'contracts');

const destPathUi = path.join(__dirname, '..', 'services', 'ui', 'src', 'frontend', 'src', 'contracts');
const destPathApi = path.join(__dirname, '..', 'services', 'api', 'src', 'contracts');

rimraf.sync(destPathUi);
rimraf.sync(destPathApi);

mkdirp.sync(destPathUi);
mkdirp.sync(destPathApi);

copyDir.sync(srcPath, destPathUi);
copyDir.sync(srcPath, destPathApi);
