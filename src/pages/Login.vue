<template>
  <div>
    <div class="jumbotron bg-danger text-white">
      <h2>#SLACK#</h2>
      <p>チャットをはじめよう</p>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col text-center">
          <button class="btn btn-outline-danger btn-lg">
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
export default {
  name: 'login',
}
</script>

<style scoped>
.btn {
}
</style>
