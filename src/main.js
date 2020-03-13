// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'

var firebaseConfig = {
  apiKey: 'AIzaSyCLMRFvB85yWCo5GRoCeBuQInsHa2fuABQ',
  authDomain: 'slack-clone-aa7cc.firebaseapp.com',
  databaseURL: 'https://slack-clone-aa7cc.firebaseio.com',
  projectId: 'slack-clone-aa7cc',
  storageBucket: 'slack-clone-aa7cc.appspot.com',
  messagingSenderId: '608182413017',
  appId: '1:608182413017:web:206aea2aad9b07db6000c8',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
window.firebase = firebase

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})
