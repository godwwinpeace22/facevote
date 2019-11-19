import Vue from 'vue'
  import Router from 'vue-router'
  import Watch from '@/components/elections/Watch'
  import $Nprogress from 'nprogress'
  import $store from './store/store'

Vue.use(Router)

const requireAuth = async (to, from, next) => {
  if($store.state.isAuthenticated){
    next()
  }
  else {
    
    let returnTo = `?returnTo=${to.fullPath}`
    next('/login' + returnTo)
  }
  // let unsubscribe = firebase.auth().onAuthStateChanged((user)=>{
    
  //   if(user && user.emailVerified){
  //     $helpers.userDetails(user).then(() =>{
  //       next() 
  //     }).catch(() => {})
  //     // next()
  //   }
  //   else{
  //     // firebase.auth().signOut()
  //     if(user && !user.emailVerified){
        
  //       next('/login?verify_email=true')
  //     }
  //     else {
  //       // console.log(to, from)
  //       next(`/login?returnTo=${to.fullPath}`)
  //     }
  //   }
  //   unsubscribe()
  // }, );
  
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path:'/home',
      component: () => import('@/views/Dashboard'),
      beforeEnter: requireAuth,
      children:[
        
        {
          path:'',
          name:'feed',
          component: () => import('@/components/feed/Feed'),
          // beforeEnter: requireAuth,
        },
        {
          path: '/posts/:postId',
          name: 'singlepost',
          component: () => import('@/components/feed/SinglePostView'),
          props: true
        },
        {
          path:'/verify',
          name:'verify_acc',
          component: () => import('@/views/Verify'),
          // beforeEnter:requireAuth,
        },
        {
          path:'/discover',
          name:'discover',
          component: () => import('@/components/Discover'),
          // beforeEnter:requireAuth,
        },
        
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/components/users/ProfileSettings')
        },
        {
          path: '/messages',
          name: 'messages',
          components: () => import('@/components/Broadcast')
        },
        {
          path:'/forum/:forumId',
          component: () => import('@/components/forum/Forum'),
          props: true,
          children:[
            {
              path:'',
              name:'members',
              component: () => import('@/components/forum/ForumUsers')
            },
            {
              path:'profile',
              name:'profile2', // this is so that something will display when its just '/profile', without the dynamic route
              component: () => import('@/components/forum/ForumUsers')
            },
            {
              path: 'profile/:username',
              name: 'profile',
              component: () => import('@/components/forum/ForumUsersProfile'),
              props: true
            },
            
          ]
        },
        {
          path: '/contest',
          name: 'contest',
          component: () => import('@/components/elections/Contest'),
        },
        {
          path: '/elections/create',
          name: 'create_election',
          component: () => import('@/components/elections/CreateElection'),
        },

        {
          path: '/elections/:electionId/',
          component: () => import('@/components/elections/ElectionHome'),
          props: true,
          children: [
            {
              path: '',
              name: 'about_election',
              component: () => import('@/components/elections/Watch'),
            },
            {
              path: 'contestants',
              name: 'contestants',
              component: () => import('@/components/elections/ElectionContestants'),
            },
            {
              path: 'voters',
              name: 'voters',
              component: () => import('@/components/elections/ElectionVoters'),
            },
            {
              path: 'manifestos',
              name: 'election_manifestos',
              component: () => import('@/components/elections/ElectionManifestos'),
            },
            {
              path: 'results',
              name: 'results',
              component: () => import('@/components/elections/ElectionResults'),
            },
          ]
        },
        {
          path: '/manifestos/:manifestoId',
          name: 'manifestos',
          component: () => import('@/components/elections/Manifestos')
        },
        {
          path: '/elections/:electionId/manager',
          name: 'manager',
          component: () => import('@/components/elections/ManageElection'),
        },
        {
          path: '/users/:username',
          component: () => import('@/components/user_profiles/index'),
          props: true,
          children: [
            {
              path: '',
              name: 'user_home',
              component: () => import('@/components/user_profiles/User__Home')
            },
            {
              path: 'posts',
              name: 'user_posts',
              component: () => import('@/components/user_profiles/User__Posts')
            },
            {
              path: 'events',
              name: 'user_events',
              component: () => import('@/components/user_profiles/User__Events')
            },
            {
              path: 'followers',
              name: 'user_followers',
              component: () => import('@/components/user_profiles/User__Followers')
            },
            {
              path: 'following',
              name: 'user_following',
              component: () => import('@/components/user_profiles/User__Following')
            },
            {
              path: 'about',
              name: 'user_about',
              component: () => import('@/components/user_profiles/User__Stats')
            },
            {
              path: 'manifestos',
              name: 'user_manifestos',
              component: () => import('@/components/user_profiles/User__Manifestos')
            },
          ]
        },
        {
          path: '/events/:eventId',
          component: () => import('@/components/events/Events'),
          props: true
        },

        {
          path:'/notFound',
          name:'notfound',
          component: () => import('@/views/404'),
          // beforeEnter: requireAuth,
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component: () => import('@/views/Login'),
      // beforeEnter:requireLogout
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Signup'),
      //beforeEnter:requireLogout
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: () => import('@/views/Confirm'),
      //beforeEnter:requireLogout
    },
    {
      path:'/reset-password',
      name:'reset-password',
      component: () => import('@/views/ResetPassword'),
      //beforeEnter:requireLogout
    },
    {
      path:'/notFound',
      name:'notfound2',
      component: () => import('@/views/404')
    }
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      $Nprogress.start()
  }
  next()
})

router.beforeEach((to, from, next) => {

  if($store.state.session_expired){
    // signout
    
  }
  else if(to.path == '/'){
    next('/home')
  }
  else if (!to.matched.length) {
    next('/notFound');
  } else {
    next();
  }
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  $Nprogress.done()
})

export default router