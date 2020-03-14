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
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  placeholder="チャンネル名"
                  class="form-control"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'channel',

  methods: {
    openModal() {
      $('#channelModal')
        .appendTo('body')
        .modal('show')
    },
  },
}
</script>
