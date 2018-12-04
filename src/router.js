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
  import EditElection from '@/components/EditElection'
  import ElectionManager from '@/components/ElectionManager'
  import NewManifesto from '@/components/NewManifesto'
  import EditManifesto from '@/components/EditManifesto'
  import Watch from '@/components/Watch'
  import Vote from '@/components/Vote'
  import Results from '@/components/Results'
  import ForumUsers from '@/components/ForumUsers'
  import ForumUsersProfile from '@/components/ForumUsersProfile'
  import SelectForum from '@/components/SelectForum'
  import SelectElection from '@/components/SelectElection'
  import User__overview from '@/components/User__overview'
  import User__broadcasts from '@/components/profile/User__broadcasts'
  import User__manifesto from '@/components/User__manifesto'
  import User__payments from '@/components/User__payments'
  import User__preferences from '@/components/User__preferences'
  import Manager__overview from '@/components/manager/Manager__overview'
  import Manager__broadcasts from '@/components/manager/Manager__broadcasts'
  import Manager__payments from '@/components/manager/Manager__payments'
  import Manager__settings from '@/components/manager/Manager__settings'
  import Default from '@/templates/Default'
  import Users from '@/views/Users'
  import Login from '@/views/Login'
  import Signup from '@/views/Signup'
  import ConfirmRegistration from '@/views/ConfirmRegistration'
  import Verify from '@/views/Verify'
  import store from '@/store/store'
  import NProgress from 'nprogress'
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

// The route guard is intentionally put in each component instead of the root to allow non-loggedin users
// to be able to see others profile
const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path:'/dashboard',
      component:Dashboard,
      
      children:[
        {
          path:'',
          name:'dashboard',
          component:Dashboard,
          beforeEnter:requireAuth
        },
        {
          path:'news',
          name:'news',
          component:News
        },
        {
          path:'enroll',
          name:'enroll',
          component:Enroll,
          beforeEnter:requireAuth,
        },
        {
          path:'verify',
          name:'verify_acc',
          component:Verify,
          beforeEnter:requireAuth,
        },
        
        {
          path:'forum',
          name:'select_forum',
          component:SelectForum,
          beforeEnter:requireAuth,
        },
        {
          path:'/users/:username',
          component:Users,
          props:true,
          children:[
            {
              path:'',
              component:User__overview
            },
            {
              path:'broadcasts',
              component:User__broadcasts
            },
            {
              path:'manifesto',
              component:User__manifesto
            },
            {
              path:'payments',
              component:User__payments
            },
            {
              path:'preferences',
              component:User__preferences
            },
          ]
        },
        
        {
          path:'forum/:electionId',
          component:Forum,
          beforeEnter:requireAuth,
          children:[
            {
              path:'',
              name:'members',
              component:ForumUsers
            },
            {
              path:'profile',
              name:'profile2', // this is so that something will display when its just '/prfile', without the dynamic route
              component:ForumUsers
            },
            {
              path:'profile/:username',
              name:'profile',
              component:ForumUsersProfile,
              props:true
            },
            
          ]
        },
        {
          path:'contest',
          name:'contest',
          component:Contest,
          beforeEnter:requireAuth,
        },
        {
          path:'manifesto/create',
          name:'addmanifesto',
          component:NewManifesto,
          beforeEnter:requireAuth,
        },
        {
          path:'manifesto/edit',
          name:'editmanifesto',
          component:EditManifesto,
          beforeEnter:requireAuth,
        },
        {
          path:'elections/manage',
          name:'manage',
          component:ManageElection,
          beforeEnter:requireAuth,
        },
        {
          path:'elections/manage/:electionId',
          name:'edit-election',
          component:ElectionManager,
          props:true,
          beforeEnter:requireAuth,
          children:[
            {
              path:'',
              component:Manager__overview,
            },
            {
              path:'broadcasts',
              component:Manager__broadcasts
            },
            {
              path:'payments',
              component:Manager__payments
            },
            {
              path:'settings',
              component:Manager__settings
            }
          ]
        },
        {
          path:'elections/create',
          name:'create_election',
          component:CreateElection,
          beforeEnter:requireAuth,
        },

        {
          path:'elections/watch',
          component:SelectElection,
          name:'selectelection',
          beforeEnter:requireAuth,
        },

        {
          path:'elections/watch/:electionId',
          component:Watch,
          beforeEnter:requireAuth,
          props:true,
        },
        {
          path:'elections/results/:electionId',
          name:'results',
          component:Results,
          beforeEnter:requireAuth,
          props:true
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login,
      beforeEnter:requireLogout
    },
    {
      path:'/signup',
      name:'signup',
      component:Signup,
      beforeEnter:requireLogout
    },
    {
      path:'/confirm/:confirmationHash',
      name:'confirm',
      component:ConfirmRegistration,
      beforeEnter:requireLogout
    }
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router