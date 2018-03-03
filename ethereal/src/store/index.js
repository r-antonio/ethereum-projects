import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    netIdString: '',
    defaultEthWallet: '',
    hasAccount: '',
    registeredAddress: ''
  },
  getters: {},
  mutations: {
    setNetworkId(state, netIdString) {
      state.netIdString = netIdString
    },
    setDefaultEthWallet(state, walletAddress) {
      state.defaultEthWallet = walletAddress
    },
    setHasAccount(state, address) {
      state.hasAccount = address
    },
    setRegisteredAddress(state, address) {
      if (address != 0x0) state.registeredAddress = address
    }
  },
  actions: {}
})

export default store
