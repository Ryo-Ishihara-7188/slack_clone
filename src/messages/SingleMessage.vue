<template>
  <div class="mt-3">
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
            <a href="#">{{ msg.user.name }}</a> - {{ msg.timestamp }}
          </h6>
          <p>{{ msg.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'single-message',
  props: ['messages'],
}
</script>
