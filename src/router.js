/* global firebase: false */ // tells eslint to treat 'db' as a globally defined variable, and that it should not be written to
import Vue from 'vue'
  import Router from 'vue-router'
  import Dashboard from '@/views/Dashboard'
  import Feed from '@/components/Feed'
  import ReadPost from '@/components/ReadPost'
  import Forum from '@/components/Forum'
  import Enroll from '@/components/Enroll'
  import Contest from '@/components/Contest'
  import CreateElection from '@/components/CreateElection'
  import ManageElection from '@/components/ManageElection'
  import NewManifesto from '@/components/NewManifesto'
  import EditManifesto from '@/components/EditManifesto'
  import Watch from '@/components/Watch'
  import ForumUsers from '@/components/ForumUsers'
  import ForumUsersProfile from '@/components/ForumUsersProfile'
  import User__overview from '@/components/User__overview'
  import Users from '@/views/Users'
  import Login from '@/views/Login'
  import ResetPassword from '@/views/ResetPassword'
  import Signup from '@/views/Signup'
  import Confirm from '@/views/Confirm'
  import Verify from '@/views/Verify'
  import NotFound from '@/views/404'
  import NProgress from 'nprogress'
  import './plugins/firebase';
  import $helpers from '@/helpers/helpers'
Vue.use(Router)

const requireAuth = async (to, from, next) => {
  firebase.auth().onAuthStateChanged((user)=>{
    if(user && user.emailVerified){
      $helpers.myEnrolled(user, false).then(() =>{
        next() 
      }).catch(() => {})
      next()
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
      component:Dashboard,
      children:[
        
        {
          path:'',
          name:'feed',
          component:Feed,
          beforeEnter: requireAuth,
        },
        {
          path:'/feed/:postId',
          name:'readfeed',
          props:true,
          component:ReadPost,
          beforeEnter:requireAuth,
        },
        {
          path:'/enroll',
          name:'enroll',
          component:Enroll,
          beforeEnter:requireAuth,
        },
        {
          path:'/verify',
          name:'verify_acc',
          component:Verify,
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
          component:Users,
          props:true,
          beforeEnter: requireAuth,
          children:[
            {
              path:'',
              component:User__overview,
              // beforeEnter: requiresPremiumAccess
            }
          ]
        },
        
        {
          path:'/forum',
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
              name:'profile2', // this is so that something will display when its just '/profile', without the dynamic route
              component:ForumUsers
            },
            {
              path:'profile/:email',
              name:'profile',
              component:ForumUsersProfile,
              props:true
            },
            
          ]
        },
        {
          path:'/contest',
          name:'contest',
          component:Contest,
          beforeEnter:requireAuth,
        },
        {
          path:'/manifesto/create',
          name:'addmanifesto',
          component:NewManifesto,
          beforeEnter:requireAuth,
        },
        {
          path:'/manifesto/edit',
          name:'editmanifesto',
          component:EditManifesto,
          beforeEnter:requireAuth,
        },
        {
          path:'/elections/manage',
          name:'manage',
          component:ManageElection,
          beforeEnter:requireAuth,
        },
        // {
        //   path:'elections/manage/:electionId',
        //   component:ElectionManager,
        //   props:true,
        //   beforeEnter:requireAuth,
        //   children:[
        //     {
        //       path:'',
        //       component:Manager__overview,
        //       name:'edit-election',
        //     },
        //     {
        //       path:'broadcasts',
        //       component:Manager__broadcasts
        //     },
        //     {
        //       path:'payments',
        //       component:Manager__payments
        //     },
        //     {
        //       path:'settings',
        //       component:Manager__settings
        //     }
        //   ]
        // },
        {
          path:'/elections/create',
          name:'create_election',
          component:CreateElection,
          beforeEnter:requireAuth,
        },

        /*{
          path:'elections/watch',
          component:SelectElection,
          name:'selectelection',
          beforeEnter:requireAuth,
        },*/

        {
          path:'/elections/vote',
          component:Watch,
          beforeEnter:requireAuth,
          props:true,
        },
        {
          path:'/notFound',
          name:'notfound',
          component:NotFound
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login,
      // beforeEnter:requireLogout
    },
    {
      path:'/signup',
      name:'signup',
      component:Signup,
      //beforeEnter:requireLogout
    },
    {
      path:'/confirm',
      name:'confirm',
      component:Confirm,
      //beforeEnter:requireLogout
    },
    {
      path:'/reset-password',
      name:'reset-password',
      component:ResetPassword,
      //beforeEnter:requireLogout
    },
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

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/notFound');
  } else {
    next();
  }
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router