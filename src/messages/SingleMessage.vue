<template>
  <div class="mt-3 mb-5">
    <div v-for="msg in messages" :key="msg.index">
      <div class="media">
        <img
          :src="msg.user.avatar"
          style="border-radius:50px;"
          height="50"
          class="align-self-start mr-3"
        />
        <div class="media-body">
          <h6 class="mt-0">
            <a href="#">{{ msg.user.name }}</a> - {{ msg.timestamp | fromNow }}
          </h6>
          <p :class="{ self_message: selfMessage(msg.user) }">
            {{ msg.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'single-message',
  props: ['messages'],

  computed: {
    ...mapGetters(['currentUser']),
  },

  methods: {
    selfMessage(user) {
      return user.id === this.currentUser.uid
    },
  },

  filters: {
    fromNow(value) {
      return moment(value).fromNow()
    },
  },
}
</script>

<style scoped>
  .self_message {
    border-left: 5px solid saddlebrown;
    padding: 0 10px;
  }
</style>