import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// State data
const state = {
  currentUser: null,
  currentChannel: null,
}

// Mutations
const mutations = {
  SET_USER(state, user) {
    state.currentUser = user
  },

  SET_CURRENT_CHANNEL(state, channel) {
    state.currentChannel = channel
  },
}

// actions
const actions = {
  setUser(state, user) {
    state.commit('SET_USER', user)
  },

  setCurrentChannel({ commit }, channel) {
    commit('SET_CURRENT_CHANNEL', channel)
  },
}

// getter
const getters = {
  currentUser: state => state.currentUser,
  currentChannel: state => state.currentChannel,
}

// create vuex store
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

export default store
