export default {
  methods: {
    handleNotifications(channelId, currentChannelId, notifCount, snapshot) {
      let lastTotal = 0
      let index = notifCount.findIndex(el => el.id === channelId)

      if (index != -1) {
        if (channelId !== currentChannelId) {
          lastTotal = notifCount[index].total

          if (snapshot.numChildren() - lastTotal > 0) {
            notifCount[index].notif = snapshot.numChildren() - lastTotal
          }
        }
        notifCount[index].lastKnownTotal = snapshot.numChildren()
      } else {
        notifCount.push({
          id: channelId,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notif: 0,
        })
      }
    },
  },
}
