var RegistryContract = artifacts.require('../contracts/AppRegistry.sol')

module.exports = function(deployer) {
  deployer.deploy(RegistryContract)
}
