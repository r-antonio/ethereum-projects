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
              <div class="card-footer-item">
                <button type="submit" :disabled="accountFormstate.$invalid" class="button is-primary is-fullwidth subtitle">Create an Account Address</button>
              </div>
            </vue-form>
              <vue-form :state="registerFormstate" @submit.prevent="onRegisterAccount">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <validate>
                        <label class="label">Username</label>
                        <div class="control">
                          <input v-model="account.name" name="name" required class="input" type="text" placeholder="Enter your account username">
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
                  <button type="submit" :disabled="registerFormstate.$invalid" class="button is-primary is-fullwidth subtitle">Register</button>
                </div>
                <p class="help" id="rgReturn"></p>
                </vue-form>

                <vue-form :state="registerFormstate" @submit.prevent="onSubmitContract">
                <div class="field">
                  <validate>
                    <label class="label">Enter your agreement</label>
                    <div class="control">
                      <textarea v-model="account.terms" name="terms" required class="textarea" type="text" placeholder="..."></textarea>
                    </div>
                  </validate>
                </div>
                <div class="field">
                  <validate>
                    <label class="label">Witness (You)</label>
                    <div class="control">
                      <input v-model="account.witness" name="witness" :disabled="!account.witness" :class="{ ['is-danger']: !account.witness }" required class="input" type="text" placeholder="This input will autofill with your Metamask wallet address">
                      <p v-if="!account.witness" class="help is-danger">You are not signed in. Sign in to <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> to use this app.</p>
                    </div>
                  </validate>
                </div>
                  <article class="message is-warning">
                    <div class="message-body">
                      Submitting this contract adds a record to the Ethereum Blockchain with the above information.
                    </div>
                  </article>
                  <div class="card-footer-item">
                    <button type="submit" :disabled="registerFormstate.$invalid" class="button is-primary is-fullwidth subtitle">Store Contract</button>
                  </div>
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
import { getRegistryContractInstance, createContractInstance, createAccountContractInstance } from '../web3Service'

export default {
  data() {
    return {
      accountFormstate: {},
      registerFormstate: {},
      account: {
        name: '',
        address: '',
        participant1: '',
        participant2: '',
        witness: this.$store.state.defaultEthWallet
      },
      wallet: this.$store.state.defaultEthWallet,
      rgReturn: '',
      accounted: '',
      registered: ''
    }
  },
  methods: {
    async onSubmitContract() {
      // TODO: validation
      const witnessContract = await createContractInstance(this.$data.contract)
      console.log('Contract was created:', witnessContract.contract_name())
    },
    async onSubmitAccount() {
      const accountContract = await createAccountContractInstance(this.$data.wallet)
      this.$data.account.address = accountContract.address
      this.$data.accounted = 'true'
    },
    async onRegisterAccount() {
      const registryContract = await getRegistryContractInstance()
      let tx = registryContract.register.sendTransaction(this.$data.account.name, this.$data.account.address)
      console.log(tx)
      console.log('Tx: ${tx}')
      this.$data.rgReturn = 'Tx: ${tx}'
      this.$data.registered = 'true'
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
