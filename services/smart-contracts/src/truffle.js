const { ETHEREUM_HOST, ETHEREUM_PORT } = process.env;

module.exports = {
  networks: {
    development: { host: ETHEREUM_HOST, port: ETHEREUM_PORT, network_id: '*' },
  },
};
