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
              :disabled="uploadState == 'uploading'"
              class="btn btn-dark mt-3"
              type="button"
            >
              &nbsp; 添付 &nbsp;
            </button>
          </div>
        </div>
      </form>

      <file-modal ref="file_modal"></file-modal>
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
      if (this.currentChannel !== null) {
        if (this.message.length > 0) {
          this.$parent
            .getMsgRef()
            .child(this.currentChannel.id)
            .push()
            .set(this.createMessage())
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

    createMessage(fileurl = null) {
      let message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid,
        },
      }

      if (fileurl == null) {
        message['content'] = this.message
      } else {
        message['image'] = fileurl
      }
      return message
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
          this.$refs.file_modal.resetForm()
        },
        () => {
          // finished
          this.uploadState = 'done'
          this.$refs.file_modal.resetForm()

          let fileUrl = this.uploadTask.snapshot.ref
            .getDownloadURL()
            .then(fileUrl => {
              this.sendFileMessage(fileUrl, ref, pathToUpload)
            })
        }
      )
    },

    sendFileMessage(fileUrl, ref, pathToUpload) {
      ref
        .child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
          this.$$nextTick(() => {
            $('html, body').scrollTop($(document).height())
          })
        })
        .catch(error => {
          this.errors.push(error.message)
        })
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

  beforeDestroy() {
    if (this.uploadTask !== null) {
      this.uploadTask.cancel()
      this.uploadTask = null
    }
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
