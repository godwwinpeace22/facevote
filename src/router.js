import Vue from 'vue'
  import Router from 'vue-router'
  import Watch from '@/components/Watch'
  import {firebase} from './plugins/firebase'
  import $helpers from '@/helpers/helpers'
  import $Nprogress from 'nprogress'
Vue.use(Router)

const requireAuth = async (to, from, next) => {
  let unsubscribe = firebase.auth().onAuthStateChanged((user)=>{
    if(user && user.emailVerified){
      $helpers.userDetails(user).then(() =>{
        next() 
      }).catch(() => {})
      // next()
    }
    else{
      // firebase.auth().signOut()
      user && !user.emailVerified ? next('/login?verify_email=true') : next('/login')
    }
    unsubscribe()
  }, );
  
}

// const requireLogout = async (to, from, next) =>{ // if ther user is not logged in

//   firebase.auth().onAuthStateChanged((user)=>{
//     if(user){
//       next('/')
//     }
//     else{
//       next()
//     }
//   });
// }

const router = new Router({
  // mode: 'history',
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
          path:'/verify',
          name:'verify_acc',
          component: () => import('@/views/Verify'),
          // beforeEnter:requireAuth,
        },
        {
          path:'/users/:username',
          // name: 'user_profile',
          component: () => import('@/components/users/Users__Profile'),
          props: true,
          children: [
            {
              path: '',
              name: 'profile_posts',
              component: () => import('@/components/users/Users__Posts'),
              props: true
            },
            // {
            //   path: 'stats',
            //   name: 'stats',
            //   component: () => import('@/components/users/Users__Stats'),
            //   props: true
            // },
            // {
            //   path: 'events',
            //   name: 'events',
            //   component: () => import('@/components/users/Users__Events'),
            //   props: true
            // },
            // {
            //   path: 'followers',
            //   name: 'followers',
            //   component: () => import('@/components/users/Users__Followers'),
            //   props: true
            // },
          ]
          // beforeEnter: requireAuth,
        },
        
        {
          path:'/forum',
          component: () => import('@/components/Forum'),
          // beforeEnter: requireAuth,
          children:[
            {
              path:'',
              name:'members',
              component: () => import('@/components/ForumUsers')
            },
            {
              path:'profile',
              name:'profile2', // this is so that something will display when its just '/profile', without the dynamic route
              component: () => import('@/components/ForumUsers')
            },
            {
              path: 'profile/:username',
              name: 'profile',
              component: () => import('@/components/ForumUsersProfile'),
              props: true
            },
            
          ]
        },
        {
          path: '/contest',
          name: 'contest',
          component: () => import('@/components/Contest'),
          // beforeEnter: requireAuth,
        },
        {
          path: '/elections/create',
          name: 'create_election',
          component: () => import('@/components/CreateElection'),
          // beforeEnter: requireAuth,
        },

        {
          path: '/elections/vote',
          component: Watch,
          // beforeEnter: requireAuth,
          props: true,
        },
        {
          path: '/events/:eventId',
          component: () => import('@/views/Events'),
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
  if(to.path == '/'){
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