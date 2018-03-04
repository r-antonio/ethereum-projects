<template>
  <div>
    <article v-if="netIdString" class="message is-link">
      <div class="message-header">
        <p>Connected To:</p>
      </div>
      <div class="message-body">
        {{ netIdString }}
      </div>
    </article>
    <article v-if="!netIdString" class="message is-danger">
      <div class="message-header">
        <p>Not Connected</p>
      </div>
      <div class="message-body">
        Please sign in to, <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> to use this app.
      </div>
    </article>
    <aside class="menu">
      <p class="menu-label">
        Menu
      </p>
      <ul class="menu-list">
        <li><router-link exact to="/lookup">Lookup Account</router-link></li>
        <li><router-link exact to="/account">Create an Account</router-link></li>
        <li><router-link exact to="/send">Send Post</router-link></li>
        <li><router-link exact to="/posts">View Posts</router-link></li>
        <li><router-link exact to="/">Home</router-link></li>
      </ul>
    </aside>
  </div>
</template>

<script>
export default {
  computed: {
    netIdString() {
      return this.$store.state.netIdString
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
