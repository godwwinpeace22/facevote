<template>
  <div>
    <navigation>
      <span slot="title">Profile</span>
      <v-tabs slot="extended_nav" v-model="model"
        color="teal" slider-color="yellow">
        <v-tab ripple
          v-for="item in ['Overview','Manifesto','Posts','Payments','Preferences']"
          :key="item"
          :href="`#${item}`"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
    </navigation>

    <v-tabs-items v-model="model">
      <v-tab-item value="Overview">
        <overview :myContests='myContests' :user='user' :posts='posts'></overview>
      </v-tab-item>
      <v-tab-item value="Manifestos">
        <manifesto :myContests='myContests' :user='user'></manifesto>
      </v-tab-item>
      <v-tab-item value="Posts">
        <posts :myContests='myContests' :user='user' :posts='posts'></posts>
      </v-tab-item>
      <v-tab-item value="Payments">
        <payments :myContests='myContests' :user='user'></payments>
      </v-tab-item>
      <v-tab-item value="Preferences">
        <preferences :myContests='myContests' :user='user'></preferences>
      </v-tab-item>
    </v-tabs-items>
    
  </div>
</template>
<script>
export default {
  data:()=>({
    hide:true,
    model:'Overview',
    follower_tab:1,
    user:'', // users profile
    about_user:[
      'name','email','phone','school','faculty','department'
    ],
    followers_id_list:[],
    myElections:[],
    myContests:[],
    broadcasts:[],
    posts:[],
    disabled:false, // disables the follow btn
    user_tabs_model:'overview'
  }),
  props:['username'],
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.setUp()
    }
  },
  components:{
    Navigation,
    Overview,
    Broadcasts,
    Posts,
    Payments,
    Preferences,
    Manifesto
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    },
    lowercase:function(value){
      if (!value) return ''
      value = value.toString()
      return value.toLowercase
    }
  },
  computed:{
   followText(){
     return this.user ? this.user.followers.indexOf(
       this.getUser.uid) == -1 ? '+ Follow' : 'Following' : ''
   },
   lowercase(val){
     return val.toUpperCase
   },
   ...mapGetters([
     'getUser',
     'getUserInfo',
     'getToken',
     'isAuthenticated'
   ])
  },
  methods:{
    async follow(){
      if(this.user.followers.indexOf(this.getUser.uid) == -1){
        // not following user, follow this user
        this.disabled = true
        this.user.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(this.getUser.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.email).update({
            following:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
          })
          this.disabled = false
        })
      }
      else{
        // is following the user, unfollow
        this.disabled = true
        this.user.followers.splice(this.user.followers.indexOf(this.getUser.uid),1)
        db.collection('moreUserInfo').doc(this.getUser.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.email).update({
            following:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
          })
          this.disabled = false
        })
      }
    },
    async getUserElections(){
      let elecRef = db.collection('elections')
      let myArr = []
      elecRef.where('contestants','array-contains',this.user.uid).get().then(doc=>{
        myArr = []
        doc.forEach(item=>{
          console.log(item.id, " => ", item.data());
          myArr.push(item.data())
        })
        this.myContests = myArr
      })
    },
    async getUserPosts(){
      db.collection('posts').where('createdBy','==',this.user.uid)
      .get().then(querySnapshot=>{
        this.posts = []
        querySnapshot.forEach(doc => {
          this.posts.push(doc.data())
        });
        console.log(this.posts)
      }).catch(err=>{
        console.log(err)
      })
    },
    async setUp(){
      try {
        if(this.$route.params.email == this.getUser.email && this.getUserInfo){
          this.user = this.getUserInfo
          console.log(this.user)
          console.log(this.getUser.email,this.getUserInfo)
          await this.getUserElections()
          await this.getUserPosts()
        }
        else{
          let user = []
          db.collection('moreUserInfo')
          .where('email','==',this.$route.params.email)
          .get().then(querySnapshot=>{
            querySnapshot.forEach(item=>{
              user.push(item.data())
            })
            
            user[0].uid == this.getUser.uid ? this.$store.dispatch('setUserInfo',user[0]) : ''
            this.user = user[0]

            this.getUserElections()
            this.getUserPosts()
          })
        }
        

      } catch (error) {
        console.log(error)
        if(error){}
      }
    }
  },
  async created(){
    try {
      console.log(this.$route.params.email)
      this.setUp()
      this.$eventBus.$on('Create_Broadcast_Resp', (data)=>{
        this.broadcasts.push(data)
      })

    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
import {mapGetters} from 'vuex'
import Navigation from '@/components/Navigation'
import Overview from '@/components/User__overview'
import Broadcasts from '@/components/profile/User__broadcasts'
import Payments from '@/components/User__payments'
import Preferences from '@/components/User__preferences'
import Posts from '@/components/profile/User__posts'
import Manifesto from '@/components/User__manifesto'
</script>

<style lang="scss" >
@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
/* --scrollbar --*/
  .scrollbar::-webkit-scrollbar {
      width: 10px;
      background-color: #d7d7df ;
      @include borderRadius(5px)
    }
  .scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #d7d7df ;
    @include borderRadius(5px)
  }
  .scrollbar::-webkit-scrollbar-thumb {
    background-color:#87899c ;
    @include borderRadius(5px);
  }
</style>
