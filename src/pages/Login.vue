<template>
  <div>
    <div class="jumbotron bg-danger text-white">
      <h2>#SLACK#</h2>
      <p>チャットをはじめよう</p>
    </div>
    <div v-if="loading" class="alert alert-info">Loading...</div>

    <div v-if="hasErrors" class="alert alert-danger">
      <div v-for="err in errors" :key="err.id">
        {{ err }}
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col text-center">
          <button
            @click="loginWithGoogle"
            class="btn btn-outline-danger btn-lg"
          >
            Googleでログイン
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <button class="btn btn-outline-info btn-lg">
            Twitterでログイン
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from 'firebase/auth'
import database from 'firebase/database'
 
export default {
  name: 'login',

  data() {
    return {
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users'),
    }
  },

  computed: {
    hasErrors() {
      return this.errors.length > 0
    },
  },

  methods: {
    loginWithGoogle() {
      this.loading = true
      this.errors = []

      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(response => {
          // Real time database にユーザーを保存
          this.saveUserToUsersRef(response.user)
          // ログインユーザーをStoreへDispatch
          this.$store.dispatch('setUser', response.user)
          // ログインが成功したらrootページへ遷移させる
          this.$router.push('/')
        })
        .catch(err => {
          this.errors.push(err.message)
          this.loading = false
        })
    },

    saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL,
      })
    },
  },
}
</script>

<style scoped></style>
