<template>
  <div>
    <div class="messageform">
      <div v-if="uploadState !== null" class="progress">
        <div
          class="progress-bar bg-danger progress-bar-animated"
          role="progressbar"
        >
          {{ uploadLabel }}
        </div>
      </div>

      <form @submit.prevent="sendMessage">
        <div class="input-group mb-3">
          <input
            v-model.trim="message"
            type="message"
            id="message"
            placeholder="メッセージ"
            class="form-control mt-3"
            autofocus
          />
          <div class="input-group-append">
            <button
              @click="sendMessage"
              class="btn btn-primary mt-3"
              type="button"
            >
              &nbsp; 送信 &nbsp;
            </button>
          </div>
          <div class="input-group-append">
            <button
              @click.prevent="openFileModal"
              class="btn btn-dark mt-3"
              type="button"
            >
              &nbsp; 添付 &nbsp;
            </button>
          </div>
        </div>
      </form>

      <file-modal ref='file_modal'></file-modal>
    </div>
  </div>
</template>

<script>
import FileModal from './FileModal'
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'
import storage from 'firebase/storage'

export default {
  name: 'message-form',

  components: {
    FileModal,
  },

  data() {
    return {
      message: '',
      errors: [],
      storageRef: firebase.storage().ref(),
      uploadTask: null,
      uploadState: null,
    }
  },

  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),

    uploadLabel() {
      switch (this.uploadState) {
        case 'uploading':
          return '送信中'
          break
        case 'error':
          return 'エラー'
          break
        case 'done':
          return '送信完了'
          break
        default:
          return ''
      }
    },
  },

  methods: {
    sendMessage() {
      let newMessage = {
        content: this.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid,
        },
      }

      if (this.currentChannel !== null) {
        if (this.message.length > 0) {
          console.log(this.$parent)
          this.$parent
            .getMsgRef()
            .child(this.currentChannel.id)
            .push()
            .set(newMessage)
            .then(() => {
              this.$nextTick(() => {
                $('html, body').scrollTop($(document).height())
              })
            })
            .catch(err => {
              this.errors.push(err.message)
            })

          this.message = ''
        }
      }
    },

    uploadFile(file, metadata) {
      if (file === null) return false

      let pathToUpload = this.currentChannel.id
      let ref = this.$parent.getMsgRef()

      let filePath = this.getPath() + '/' + uuidv4() + '.jpg'

      this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
      this.uploadState = 'uploading'

      this.uploadTask.on(
        'state_changed',
        snapshot => {
          // progress
          let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          $('.progress-bar').css('width', percent + '%')
        },
        error => {
          // errors
          this, errors.push(error.message)
          this.uploadState = 'error'
          this.uploadTask = null
        },
        () => {
          // finished
          this.uploadState = 'done'
          this.$refs.file_modal.resetForm()
        }
      )
    },

    getPath() {
      if (this.isPrivate) {
        return 'chat/private/' + this.currentChannel.id
      } else {
        return 'chat/public'
      }
    },

    openFileModal() {
      $('#fileModal')
        .appendTo('body')
        .modal('show')
    },
  },

  mounted() {
    $('html, body').scrollTop($(document).height())
  },
}
</script>

<style scoped>
.messageform {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 67%;
  z-index: 100;
  color: white;
  text-align: center;
  margin-bottom: -16px;
  margin-left: 33.3%;
}
input,
button {
  height: 50px;
}
.progress {
  margin-bottom: -16px;
}
</style>
