const fs = require('fs');
const path = require('path');

const services = ['api', 'ui', 'smart-contracts'];

services.forEach((service) => {
  fs.writeFileSync(
    path.join(__dirname, '..', 'services', service, '.env'),
    fs.readFileSync(path.join(__dirname, '..', 'services', service, '.env.sample'), 'utf8'),
  );
});
