<template>
  <div>
    <div class="jumbotron bg-danger text-white">
      <h2>#SLACK#</h2>
      <p>チャットをはじめよう</p>
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

export default {
  name: 'login',
  methods: {
    loginWithGoogle() {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(response => {
          console.log(response.user)
        })
    },
  },
}
</script>

<style scoped>
.btn {
}
</style>
