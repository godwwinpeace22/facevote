import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import store from '@/store/store'
Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {  // true if user is logged in
    next()
  } else {
    next('/login') 
  }
}
const requireLogout = (to, from, next) =>{ // if ther user is not logged in
  if(!store.getters.isAuthenticated){
    next()
  }
  else{
    next('/dashboard')
  }
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component:Dashboard,
      beforeEnter:requireAuth
    },
    {
      path:'/login',
      name:'login',
      component:Login,
      beforeEnter:requireLogout
    }
  ]
})
