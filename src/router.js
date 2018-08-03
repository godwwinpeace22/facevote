import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Dashboard from '@/views/Dashboard'
import Feed from '@/components/Feed'
import News from '@/components/News'
import Forum from '@/components/Forum'
import Enroll from '@/components/Enroll'
import Contest from '@/components/Contest'
import CreateElection from '@/components/CreateElection'
import ManageElection from '@/components/ManageElection'
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
      name:'',
      component:Dashboard,
      beforeEnter:requireAuth,
      children:[
        {
          path:'feed',
          name:'feed',
          component:Feed
        },
        {
          path:'news',
          name:'news',
          component:News
        },
        {
          path:'enroll',
          name:'enroll',
          component:Enroll
        },
        {
          path:'forum',
          name:'forum',
          component:Forum
        },
        {
          path:'contest',
          name:'contest',
          component:Contest
        },
        {
          path:'elections/manage',
          name:'manage',
          component:ManageElection,
          
        },
        {
          path:'elections/create',
          name:'create_election',
          component:CreateElection
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login,
      beforeEnter:requireLogout
    }
  ]
})
