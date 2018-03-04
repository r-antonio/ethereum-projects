import Vue from 'vue'
import Router from 'vue-router'

import Hello from '../components/Hello.vue'
import AccountCreate from '../components/AccountCreate.vue'
import ViewPosts from '../components/ViewPosts.vue'
import SendPost from '../components/SendPost.vue'
import LookupAccount from '../components/LookupAccount.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      components: {
        default: Hello
      }
    },
    {
      path: '/account',
      components: {
        default: AccountCreate
      }
    },
    {
      path: '/lookup',
      components: {
        default: LookupAccount
      }
    },
    {
      path: '/posts',
      components: {
        default: ViewPosts
      }
    },
    {
      path: '/send',
      components: {
        default: SendPost
      }
    }
  ]
})
