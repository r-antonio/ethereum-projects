import contract from 'truffle-contract'
import Web3 from 'web3'

import accountContractJSON from '../build/contracts/UserAccount.json'
import registryContractJSON from '../build/contracts/AppRegistry.json'

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

const AccountContract = contract({
  abi: accountContractJSON.abi,
  binary: accountContractJSON.bytecode
})

const RegistryContract = contract({
  abi: registryContractJSON.abi,
  binary: registryContractJSON.bytecode
})

AccountContract.setProvider(web3.currentProvider)
RegistryContract.setProvider(web3.currentProvider)

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

const getRegisteredAddress = async () => {
  const wallet = await getDefaultEthWallet()
  const registry = await getRegistryContractInstance()
  const result = await registry.getAccountAddressOfAddress.call(wallet)
  return result
}

const getRegisteredAddressOfName = async name => {
  const registry = await getRegistryContractInstance()
  return await registry.getAccountAddressOfName.call(name)
}

const getRegisteredAddressOfAddress = async addr => {
  const registry = await getRegistryContractInstance()
  return await registry.getAccountAddressOfAddress.call(addr)
}

const createPost = async p => {
  const account = await getAccountContractInstance(p.address)
  return await account.post.sendTransaction(p.message, p.dataType, p.data, {from:p.wallet,gas:1500000,gasPrice:2000000000})
}

const getLastPost = async address => {
  const account = await getAccountContractInstance(address)
  return await account.getLastPost.call()
}

const getUsername = async address => {
  const account = await getAccountContractInstance(address)
  return await account.getName.call()
}

const getPost = async (address, id) => {
  const account = await getAccountContractInstance(address)
  return await account.getPost.call(id)
}

const getNumberOfPosts = async addr => {
  const account = await getAccountContractInstance(addr)
  return await account.getNumberOfPosts.call()
}

const createAccountContractInstance = async (addr, username) => {
  // https://github.com/trufflesuite/truffle-contract/issues/70
  const newContract = new web3.eth.Contract(accountContractJSON.abi)

  const createdContract = await newContract
    .deploy({
      data: accountContractJSON.bytecode,

      // Contract constructor arguments
      arguments: [username]
    })
    .send({
      from: addr,

      // Gas.
      gas: 1500000,
      gasPrice: '2000000000'
    })

  return await AccountContract.at(createdContract.options.address)
}

const getRegistryContractInstance = async () => {
  return await RegistryContract.at('0x02856c9796732cfd5f35e523aff542c2c30ca9b1')
}

const getAccountContractInstance = async addr => {
  return await AccountContract.at(addr)
}

export { getUsername, getPost, getLastPost, getNumberOfPosts, getRegisteredAddressOfAddress, createPost, getAccountContractInstance, getRegisteredAddressOfName, getRegisteredAddress, getRegistryContractInstance, createAccountContractInstance, getDefaultEthWallet, getNetIdString }
