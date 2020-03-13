import Vue from 'vue'
import Router from 'vue-router'
import auth from 'firebase/auth'

import Chat from '@/pages/Chat'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'chat',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (!firebase.auth().currentUser) {
          next('/login')
        } else {
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})
