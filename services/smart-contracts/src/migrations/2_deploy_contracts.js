/*
  global
  artifacts:true,
*/

const Sample = artifacts.require('./Sample.sol');

module.exports = async (deployer) => {
  // deploy with the possible choices
  await deployer.deploy(
    Sample,
    'name of contract',
    ['Utrecht', 'Amsterdam', 'Rotterdam', 'Den Haag'],
  );
};
