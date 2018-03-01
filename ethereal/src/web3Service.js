import contract from 'truffle-contract'
import Web3 from 'web3'

import witnessContractJSON from '../build/contracts/WitnessContract.json'
import accountContractJSON from '../build/contracts/UserAccount.json'

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

const WitnessContract = contract({
  abi: witnessContractJSON.abi,
  binary: witnessContractJSON.bytecode
})

const AccountContract = contract({
  abi: accountContractJSON.abi,
  binary: accountContractJSON.bytecode
})

WitnessContract.setProvider(web3.currentProvider)
AccountContract.setProvider(web3.currentProvider)

const getNetIdString = async () => {
  const id = await web3.eth.net.getId()
  // TODO: Remove this
  switch (id) {
    case 1:
      return 'Main Ethereum Network'
    case 3:
      return 'Ropsten Test Network'
    case 4:
      return 'Rinkeby Test Network'
    case 42:
      return 'Kovan Test Network'
    case 'loading':
      return undefined
    // Will be some random number when connected locally
    default:
      return 'Local Test Net'
  }
}

const getDefaultEthWallet = () =>
  new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, res) => {
      if (!err) return resolve(res[0])
      reject(err)
    })
  })

const createContractInstance = async c => {
  // https://github.com/trufflesuite/truffle-contract/issues/70
  const newContract = new web3.eth.Contract(witnessContractJSON.abi)

  const createdContract = await newContract
    .deploy({
      data: witnessContractJSON.bytecode,

      // Contract constructor arguments
      arguments: [c.name, c.terms]
    })
    .send({
      from: c.witness,

      // Gas.
      gas: 1500000,
      gasPrice: '20000000000000'
    })

  return await WitnessContract.at(createdContract.options.address)
}

const createAccountContractInstance = async addr => {
  // https://github.com/trufflesuite/truffle-contract/issues/70
  const newContract = new web3.eth.Contract(accountContractJSON.abi)

  const createdContract = await newContract
    .deploy({
      data: accountContractJSON.bytecode,

      // Contract constructor arguments
      arguments: []
    })
    .send({
      from: addr,

      // Gas.
      gas: 1500000,
      gasPrice: '20000000000000'
    })

  return await AccountContract.at(createdContract.options.address)
}

export { createAccountContractInstance, createContractInstance, getDefaultEthWallet, getNetIdString }