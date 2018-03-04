<template>
  <div>
    <top-nav></top-nav>
    <div class="container">
      <div class="columns">
          <main-menu class="column is-one-quarter" />
          <div class="column is-three-quarters">
            <div class="box">
            <vue-form :state="nameFormstate" @submit.prevent="onSubmitSearch">
              <div class="field">
                <validate>
                  <label class="label">Username</label>
                  <div class="control">
                    <input v-model="account.name" name="name" required class="input" type="text" placeholder="Enter your account username">
                  </div>
                </validate>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="nameFormstate.$invalid" class="button is-link is-fullwidth subtitle">See Posts</button>
              </div>
              <p class="help">{{ sReturn }}</p>
            </vue-form>
            <vue-form :state="addressFormstate" @submit.prevent="onSubmitAddress">
              <div class="field">
                <validate>
                  <label class="label">Wallet Address</label>
                  <div class="control">
                    <input v-model="wallet" name="wallet" required class="input" type="text" placeholder="Enter your wallet address">
                  </div>
                </validate>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="addressFormstate.$invalid" class="button is-link is-fullwidth subtitle">See Posts</button>
              </div>
              <p class="help">{{ aReturn }}</p>
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
import { getRegisteredAddressOfAddress, getRegisteredAddressOfName } from '../web3Service'

export default {
  data() {
    return {
      nameFormstate: {},
      addressFormstate: {},
      account: {
        name: '',
      },
      wallet: this.$store.state.defaultEthWallet,
      sReturn: '',
      aReturn: ''
    }
  },
  methods: {
    async onSubmitSearch() {

      const result = await getRegisteredAddressOfName(this.$data.account.name)
      console.log(result)
      this.$data.sReturn = result
    },
    async onSubmitAddress() {
      const result = await getRegisteredAddressOfAddress(this.$data.wallet)
      console.log(result)
      this.$data.aReturn = result
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
