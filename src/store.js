import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// State data
const state = {
  currentUser: 'Totti',
}

// Mutations
const mutations = {
  SET_USER(state, user) {
    state.currentUser = user
  },
}

// actions
const actions = {
  setUser(state, user) {
    state.commit('SET_USER', user)
  },
}

// getter
const getters = {
  currentUser: state => state.currentUser,
}

// create vuex store
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

export default store
