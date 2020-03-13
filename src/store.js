import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// State data
const state = {
  currentUser: 'Totti',
}

// Mutations
const mutations = {}

// actions
const actions = {}

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
