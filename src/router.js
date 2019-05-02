/* global firebase: false, $NProgress: false */ // tells eslint to treat 'db' as a globally defined variable, and that it should not be written to

import Vue from 'vue'
  import Router from 'vue-router'
  // import Dashboard from '@/views/Dashboard'
  // import NProgress from 'nprogress'
  import './plugins/firebase';
  import $helpers from '@/helpers/helpers'
Vue.use(Router)

const requireAuth = async (to, from, next) => {
  firebase.auth().onAuthStateChanged((user)=>{
    if(user && user.emailVerified){
      $helpers.myEnrolled(user, false).then(() =>{
        next() 
      }).catch(() => {})
      // next()
    }
    else{
      firebase.auth().signOut()
      next('/login')
    }
  });
  
}


// const requiresPremiumAccess = async (to, from, next) =>{ // if ther user is not logged in
//   //console.log('islgdin: ', await isLoggedIn)
//   firebase.auth().currentUser.getIdTokenResult()
//     .then((idTokenResult) => {
      
//       // console.log(idTokenResult.claims)
//       idTokenResult.claims.superuser ? next() :
//       next('/notFound')
      
      
//     })
// }
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

// The route guard is intentionally put in each component instead of the root to allow non-loggedin users
// to be able to see others profile
const router = new Router({
  //mode:'history',
  routes: [
    {
      path:'/home',
      component: () => import('@/views/Dashboard'),
      children:[
        
        {
          path:'',
          name:'feed',
          component: () => import('@/components/Feed'),
          beforeEnter: requireAuth,
        },
        {
          path:'/feed/:postId',
          name:'readfeed',
          props:true,
          component: () => import('@/components/ReadPost'),
          beforeEnter:requireAuth,
        },
        {
          path:'/enroll',
          name:'enroll',
          component: () => import('@/components/Enroll'),
          beforeEnter:requireAuth,
        },
        {
          path:'/verify',
          name:'verify_acc',
          component: () => import('@/views/Verify'),
          beforeEnter:requireAuth,
        },
        
        /*{
          path:'forum',
          name:'select_forum',
          component:SelectForum,
          beforeEnter:requireAuth,
        },*/
        {
          path:'/users/:email',
          component: () => import('@/views/Users'),
          props:true,
          beforeEnter: requireAuth,
          children:[
            {
              path:'',
              component: () => import('@/components/User__overview'),
              // beforeEnter: requiresPremiumAccess
            }
          ]
        },
        
        {
          path:'/forum',
          component: () => import('@/components/Forum'),
          beforeEnter: requireAuth,
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
              path: 'profile/:email',
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
          beforeEnter: requireAuth,
        },
        // {
        //   path:'/elections/manage',
        //   name:'manage',
        //   component: ManageElection,
        //   beforeEnter:requireAuth,
        // },
        {
          path: '/elections/create',
          name: 'create_election',
          component: () => import('@/components/CreateElection'),
          beforeEnter: requireAuth,
        },

        {
          path: '/elections/vote',
          component: () => import('@/components/Watch'),
          beforeEnter: requireAuth,
          props: true,
        },
        {
          path:'/notFound',
          name:'notfound',
          component: () => import('@/views/404')
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
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      $NProgress.start()
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
  $NProgress.done()
})

export default router