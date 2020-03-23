<template>
  <div>
    <button @click="openModal" class="btn btn-outline-light">
      チャンネルを追加
    </button>

    <div class="mt-4">
      <div class="text-white">・チャンネル</div>
      <ul>
        <li
          v-for="channel in channels"
          :key="channel.index"
          @click="changeChannel(channel)"
          class="text-white"
          style="cursor:pointer"
          :class="{
            'text-info font-weight-bold': setActiveChannel(channel),
            'font-weight-light': !setActiveChannel(channel),
          }"
        >
          {{ channel.name }}
          <span
            v-if="
              getNotification(channel) > 0 && channel.id !== currentChannel.id
            "
            class="float-right"
          >
            {{ getNotification(channel) }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="channelModal">
      <div class="modal-dialog modal-dialog-center" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">Modal title</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <input
                  v-model="new_channel"
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  placeholder="チャンネル名"
                  class="form-control"
                />
              </div>
              <ul v-if="hasErrors" class="list-group">
                <li
                  v-for="err in errors"
                  :key="err.index"
                  class="list-group-item text-danger"
                >
                  {{ err }}
                </li>
              </ul>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              閉じる
            </button>
            <button @click="addChannel" type="button" class="btn btn-primary">
              追加
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'
import mixin from '../mixins'

export default {
  name: 'channel',

  data() {
    return {
      new_channel: '',
      errors: [],
      channelsRef: firebase.database().ref('channels'),
      messagesRef: firebase.database().ref('messages'),
      notifCount: [],
      channels: [], // 登録済みチャンネル一覧
      channel: null,
    }
  },

  mixins: [mixin],

  computed: {
    ...mapGetters(['currentChannel', 'isPrivate']),

    hasErrors() {
      return this.errors.length > 0
    },
  },

  watch: {
    isPrivate() {
      if (this.isPrivate) {
        this.resetNotifications()
      }
    },
  },

  methods: {
    openModal() {
      $('#channelModal')
        .appendTo('body')
        .modal('show')
    },
    addChannel() {
      this.errors = []
      // チャンネルのユニークキーを生成
      let key = this.channelsRef.push().key
      let newChannel = { id: key, name: this.new_channel }
      // チャンネルをDBに保存
      this.channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
          this.new_channel = ''
          $('#channelModal').modal('hide')
        })
        .catch(err => {
          console.log(err.message)
          this.errors.push(err.message)
        })
    },
    addListeners() {
      this.channelsRef.on('child_added', snapshot => {
        // チャンネル一覧を取得
        this.channels.push(snapshot.val())
        // アクティブチャンネルの初期値をセット
        if (this.channels.length > 0) {
          this.channel = this.channels[0]
          this.$store.dispatch('setCurrentChannel', this.channel)
        }

        this.addCountListener(snapshot.key)
      })
    },

    addCountListener(channelId) {
      this.messagesRef.child(channelId).on('value', snapshot => {
        this.handleNotifications(
          channelId,
          this.currentChannel.id,
          this.notifCount,
          snapshot
        )
      })
    },

    getNotification(channel) {
      let notif = 0
      this.notifCount.forEach(el => {
        if (el.id === channel.id) {
          notif = el.notif
        }
      })
      return notif
    },

    setActiveChannel(channel) {
      return channel.id === this.currentChannel.id
    },

    changeChannel(channel) {
      this.resetNotifications()
      this.$store.dispatch('setPrivate', false)
      this.$store.dispatch('setCurrentChannel', channel)
      this.channel = channel
    },

    resetNotifications() {
      let index = this.notifCount.findIndex(el => el.id === this.channel.id)
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal
        this.notifCount[index].notif = 0
      }
    },

    detachListeners() {
      this.channelsRef.off()
      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    },
  },

  // ライフサイクルフック
  mounted() {
    this.addListeners()
  },

  beforeDestroy() {
    this.detachListeners()
  },
}
</script>
