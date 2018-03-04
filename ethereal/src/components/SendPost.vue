<template>
  <div>
    <top-nav></top-nav>
    <div class="container">
      <div class="columns">
          <main-menu class="column is-one-quarter" />
          <div class="column is-three-quarters">
            <div class="box">
            <vue-form :state="formstate" @submit.prevent="onSubmitPost">
            <p v-if="!post.wallet" class="help is-danger">You are not signed in. Sign in to <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> to use this app.</p>
              <div class="field">
                <validate>
                  <label class="label">Message</label>
                  <div class="control">
                    <input v-model="post.message" name="message" required class="input" type="text" placeholder="Enter your message">
                  </div>
                </validate>
              </div>
              <div class="field">
                <validate>
                  <label class="label">Data Type</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="post.dataType" name="dataType" required>
                        <option value="0">Text</option>
                        <option value="1">Link</option>
                      </select>
                    </div>
                  </div>
                </validate>
              </div>
              <div class="field">
                <validate>
                  <label class="label">Data (optional)</label>
                  <div class="control">
                    <input v-model="post.data" name="data" class="input" type="text" placeholder="Enter your link here">
                  </div>
                </validate>
              </div>
              <div class="field">
                <validate>
                  <label class="label">Wallet</label>
                  <div class="control">
                    <input v-model="post.wallet" name="wallet" required class="input" type="text" placeholder="Enter your link here">
                  </div>
                </validate>
              </div>
              <div class="card-footer-item">
                <button type="submit" :disabled="formstate.$invalid" class="button is-primary is-fullwidth subtitle">Send Post</button>
              </div>
              <p class="help">{{ sReturn }}</p>
              <p class="help">{{ postCount }}</p>
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
import { getNumberOfPosts, getRegisteredAddressOfAddress, createPost } from '../web3Service'

export default {
  data() {
    return {
      formstate: {},
      post: {
        wallet: this.$store.state.defaultEthWallet,
        address: '',
        message: '',
        dataType: '0',
        data: ''
      },
      sReturn: '',
      postCount: ''
    }
  },
  methods: {
    async onSubmitPost() {
      const accountAddress = await getRegisteredAddressOfAddress(this.$data.post.wallet)
      this.$data.post.address = accountAddress
      const postTx = await createPost(this.$data.post)
      this.$data.sReturn = 'Tx: '+postTx
      const nTx = await getNumberOfPosts(this.$data.post.address)
      this.$data.postCount = 'Number of posts: '+nTx
      console.log(nTx)
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
