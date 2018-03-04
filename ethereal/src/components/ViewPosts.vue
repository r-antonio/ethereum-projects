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
                <button type="submit" :disabled="formstate.$invalid" class="button is-link is-fullwidth subtitle">See Posts</button>
              </div>
              <p class="help">{{ sReturn }}</p>
            </vue-form>
            </div>

            <div v-for="post in posts">
              <div class="box">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-64x64">
                      <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>John Smith</strong> <small>@{{ account.name }}</small> <small>{{ getTime(post.timestamp) }}</small>
                        <br>
                        {{ post.message }}
                      </p>
                    </div>
                    <nav class="level is-mobile">
                      <div class="level-left">
                        <a class="level-item">
                          <span class="icon is-small"><i class="fas fa-reply"></i></span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small"><i class="fas fa-heart"></i></span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </article>
              </div>
            </div>

          </div>
      </div>

    </div>
  </div>
</template>

<script>
import MainMenu from './MainMenu'
import TopNav from './TopNav.vue'
import { getPost, getLastPost, getRegisteredAddressOfName } from '../web3Service'

export default {
  data() {
    return {
      formstate: {},
      account: {
        name: '',
        address: '',
        lastId: 0
      },
      posts: [],
      wallet: this.$store.state.defaultEthWallet,
      sReturn: ''
    }
  },
  methods: {
    pluralizeTime(diff, category) {
      return (diff > 1)? diff+' '+category+'s ago' : diff+' '+category+' ago'
    },
    getTime(utcTime) {
      const timeDiff = (new Date()).getTime() - (utcTime*1000)
      const diffSeconds = Math.floor(timeDiff / 1000)
      const diffMins = Math.floor(diffSeconds / 60)
      const diffHrs = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHrs / 24)
      const diffYears = Math.floor(diffDays / 365)
      if(diffYears > 0) return this.pluralizeTime(diffYears, 'year')
      if(diffDays > 0) return this.pluralizeTime(diffDays, 'day')
      if(diffHrs > 0) return this.pluralizeTime(diffHrs, 'hour')
      if(diffMins > 0) return this.pluralizeTime(diffMins, 'minute')
      return 'right now'
    },
    buildPost(arr) {
      return {
        message: arr[0],
        timestamp: arr[1].c[0],
        dataType: arr[2].c[0],
        data: arr[3],
        lastEdited: arr[4].c[0]
        }
    },
    async getPosts(firstQuery) {
      const limit = (this.$data.account.lastId >= 10)? this.$data.account.lastId-10 : 0
      const start = (firstQuery)? 2 : 1
      for(let i = this.$data.account.lastId-start; i >= limit; i--) {
        const p = await getPost(this.$data.account.address, i)
        console.log(p)
        this.$data.posts.push(this.buildPost(p))
      }
      console.log(this.$data.posts)
    },
    async onSubmitSearch() {
      const result = await getRegisteredAddressOfName(this.$data.account.name)
      this.$data.account.address = result
      const lastPost = await getLastPost(this.$data.account.address)
      this.$data.account.lastId = lastPost[5].c[0]
      const post = this.buildPost(lastPost)
      this.$data.posts.push(post)
      this.getPosts(true)
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
