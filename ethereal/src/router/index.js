import Vue from 'vue'
import Router from 'vue-router'

import Hello from '../components/Hello.vue'
import AccountCreate from '../components/AccountCreate.vue'
import ContractView from '../components/ContractView.vue'

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
      path: '/contracts',
      components: {
        default: ContractView
      }
    }
  ]
})
