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
                <button type="submit" :disabled="formstate.$invalid || (lastUser == account.name)" class="button is-link is-fullwidth subtitle">See Posts</button>
              </div>
              <p class="help">{{ sReturn }}</p>
            </vue-form>
            </div>

            <div v-for="post in posts">
              <div class="box">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-64x64">
                      <img v-bind:src="account.icon" alt="Address Icon">
                    </figure>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>{{ account.showName }}</strong> <small>@{{ account.name }}</small> <small>{{ getTime(post.timestamp) }}</small> <small v-if="post.lastEdited > post.timestamp"> - Edited</small>
                        <br>
                        {{ post.message }}
                      </p>
                      <link-prevue v-if="post.dataType == 1" v-bind:url="post.data">
                        <template slot-scope="props">
                          <br>
                          <div class="card-image">
                            <figure class="image" style="max-width:480px">
                              <img :src="props.img" :alt="props.title">
                            </figure>
                          </div>
                          <div class="card-content">
                            <a :href="props.url"><p class="title is-5">{{ props.title }}</p></a>
                            <p>
                              {{ props.description }}
                            </p>
                          </div>
                        </template>
                      </link-prevue>
                    </div>
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

const blockies = require('ethereum-blockies-png')
import LinkPrevue from 'link-prevue'

import { getUsername, getPost, getLastPost, getRegisteredAddressOfName } from '../web3Service'

export default {
  data() {
    return {
      formstate: {},
      account: {
        icon: '',
        name: '',
        address: '',
        lastId: 0,
        showName: ''
      },
      lastUser: '',
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
      this.$data.posts = []
      this.$data.lastUser = this.$data.account.name
      const result = await getRegisteredAddressOfName(this.$data.account.name)
      this.$data.account.address = result
      this.$data.account.icon = blockies.createDataURL({ seed: result })
      console.log(this.$data.account.icon)
      const lastPost = await getLastPost(this.$data.account.address)
      this.$data.account.lastId = lastPost[5].c[0]
      const post = this.buildPost(lastPost)
      this.$data.posts.push(post)
      const sName = await getUsername(this.$data.account.address)
      this.$data.account.showName = sName
      this.getPosts(true)
    }
  },
  components: {
    MainMenu,
    TopNav,
    LinkPrevue
  }
}
</script>

<style lang="sass" scoped>
    .container
      padding-top: 4rem
</style>
