var WitnessContract = artifacts.require('../contracts/WitnessContract.sol')

module.exports = function(deployer) {
  deployer.deploy(WitnessContract,"My contract","My Terms")
}
