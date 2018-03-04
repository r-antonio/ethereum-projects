<template>
  <div>
    <top-nav></top-nav>
    <div class="container">
      <div class="columns">
          <main-menu class="column is-one-quarter" />
          <div class="column is-three-quarters">
            <div class="box">
            <vue-form v-if="!accounted" :state="accountFormstate" @submit.prevent="onSubmitAccount">
            <p v-if="!wallet" class="help is-danger">You are not signed in. Sign in to <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> to use this app.</p>
              <div class="field">
                <validate>
                  <label class="label">Account Username</label>
                  <div class="control">
                    <input v-model="username" name="username" required class="input" type="text" placeholder="Enter your account username">
                  </div>
                </validate>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="accountFormstate.$invalid" class="button is-link is-fullwidth subtitle">Create an Account Address</button>
              </div>
            </vue-form>
            <vue-form :state="registerFormstate" @submit.prevent="onRegisterAccount">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <validate>
                      <label class="label">Registry Username</label>
                      <div class="control">
                        <input v-model="account.name" name="name" required class="input" type="text" placeholder="Enter your registry account username">
                      </div>
                    </validate>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <validate>
                      <label class="label">Account Address</label>
                      <div class="control">
                        <input v-model="account.address" name="address" required class="input" type="text" placeholder="Enter your account address">
                      </div>
                      <p class="help">Enter a valid Ethereum wallet address</p>
                    </validate>
                  </div>
                </div>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="registerFormstate.$invalid" class="button is-link is-fullwidth subtitle">Register</button>
              </div>
              <p class="help">{{ rgReturn }}</p>
            </vue-form>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from './MainMenu'
import TopNav from './TopNav.vue'
import { getRegistryContractInstance, createAccountContractInstance } from '../web3Service'

export default {
  data() {
    return {
      accountFormstate: {},
      registerFormstate: {},
      username: '',
      account: {
        name: '',
        address: '',
        participant1: '',
        participant2: '',
        witness: this.$store.state.defaultEthWallet
      },
      wallet: this.$store.state.defaultEthWallet,
      accounted: this.$store.state.hasAccount,
      registered: this.$store.state.registeredAddress,
      rgReturn: ''
    }
  },
  methods: {
    async onSubmitAccount() {
      console.log(this.$store.state.hasAccount)
      const accountContract = await createAccountContractInstance(this.$data.wallet, this.$data.username)
      this.$data.account.address = accountContract.address
      this.$store.commit('setHasAccount', accountContract.address)
      console.log(this.$store.state.hasAccount)
      this.$data.accounted = 'true'
    },
    async onRegisterAccount() {
      console.log('Registering account...')
      const registryContract = await getRegistryContractInstance()
      const tx = await registryContract.register.sendTransaction(this.$data.account.name, this.$data.account.address, {from:this.$data.wallet,gas:1500000,gasPrice:2000000000})
      console.log(tx)
      this.$data.rgReturn = 'Tx: '+tx
      //this.$data.registered = 'true'
    }
  },
  components: {
    MainMenu,
    TopNav
  }
}
</script>

<style lang="sass" scoped>
    .container
      padding-top: 4rem
</style>
