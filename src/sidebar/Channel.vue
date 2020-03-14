<template>
  <div>
    <button @click="openModal" class="btn btn-outline-light">
      チャンネルを追加
    </button>

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

export default {
  name: 'channel',

  data() {
    return {
      new_channel: '',
      errors: [],
      channelsRef: firebase.database().ref('channels'),
    }
  },

  computed: {
    hasErrors() {
      return this.errors.length > 0
    },
  },

  methods: {
    openModal() {
      $('#channelModal')
        .appendTo('body')
        .modal('show')
    },
    addChannel() {
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
  },
}
</script>
