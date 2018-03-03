<template>
  <div>
    <top-nav></top-nav>
    <div class="container">
      <div class="columns">
          <main-menu class="column is-one-quarter" />
          <div class="column is-three-quarters">
            <div class="box">
            <vue-form :state="formstate" @submit.prevent="onSubmitSearch">
              <div class="field">
                <validate>
                  <label class="label">Username</label>
                  <div class="control">
                    <input v-model="account.name" name="name" required class="input" type="text" placeholder="Enter your account username">
                  </div>
                </validate>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="formstate.$invalid" class="button is-primary is-fullwidth subtitle">Register</button>
              </div>
              <p class="help">{{ sReturn }}</p>
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
import { getRegisteredAddressOfName } from '../web3Service'

export default {
  data() {
    return {
      formstate: {},
      account: {
        name: ''
      },
      wallet: this.$store.state.defaultEthWallet,
      sReturn: ''
    }
  },
  methods: {
    async onSubmitSearch() {
      const result = await getRegisteredAddressOfName(this.$data.account.name)
      console.log(result)
      this.$data.sReturn = result
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
