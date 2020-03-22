<template>
  <div>
    <h2 class="text-light">#SLACK#</h2>
    <hr style="border: 0.5px solid #fff" />
    <span>
      <img
        class="rounded-circle mr-2"
        height="30"
        :src="currentUser.photoURL"
      />
      <span class="text-light">{{ currentUser.displayName }}</span>
    </span>
    <hr style="border: 0.5px solid #fff" />
    <button @click="logout" class="btn btn-outline-light">ログアウト</button>

    <hr style="border: 0.5px solid #fff" />
    <channel></channel>

    <hr style="border: 0.5px solid #fff" />
    <users></users>
  </div>
</template>

<script>
import Channel from './Channel'
import Users from './Users'
import auth from 'firebase/auth'
import { mapGetters } from 'vuex'
import database from 'firebase/database'

export default {
  name: 'sidebar',

  components: {
    Channel,
    Users,
  },

  data() {
    return {
      presenceRef: firebase.database().ref('presence'),
    }
  },

  computed: {
    ...mapGetters(['currentUser']),
  },

  methods: {
    logout() {
      this.presenceRef.child(this.currentUser.uid).remove()
      firebase.auth().signOut()
      this.$store.dispatch('setUser', null)
      this.$router.push('/login')
    },
  },
}
</script>
