<template>
  <div>
    <vue-headful :title="title | capitalize"/>

    <navigation>
      <span slot="title">Profile</span>
    </navigation>

    <!-- LOADING WIREFRAME -->
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <div v-else>
        <div>
          <v-container class="pt-0">
            <v-row row wrap>

              <!-- PROFILE -->
              <v-col sm="12" md="8">
                <v-card outlined height="">
                  <v-sheet flat tile width="100%" 
                    height="200" 
                    :color="$helpers.colorMinder(user.name.charAt(0)) + ' lighten-3'">

                  </v-sheet>
                  <v-sheet flat width="20%" height="124" 
                    style="position: absolute;top: 135px;left: 0;" color="transparent">
                    <v-avatar
                      size="124"
                      color="white"
                      class="elevation-1 d-block mx-auto"
                      style="padding-top: 2px;"
                    >
                      
                      <v-avatar class="d-block mx-auto"
                        size="120"
                        :color="$helpers.colorMinder(user.name.charAt(0))"
                      >
                        <img :src="user.photoURL" :alt="user.name" v-if="user.photoURL">
                        <span v-else class="d-block white--text display-2 text-capitalize" style="padding-top: 35px;">{{user.name.charAt(0)}}</span>
                      </v-avatar>
                    </v-avatar>
                  </v-sheet>

                  <v-card-text class=" " style="margin-top: 65px;">
                    <span class="title text-capitalize">{{user.name | capitalize}}</span>
                    <v-tooltip right>
                      <template v-slot:activator="{on}">
                        <v-icon color="success" style="font-size: 20px" v-on="on" v-if="is_verified">mdi-check-decagram</v-icon>
                      </template>
                      <span>User is verified</span>
                    </v-tooltip> 
                    <!-- <span class="online_badge" :class="user.online ? 'success' : 'orange'"></span> -->
                    <div class="" v-if="user.is_student">Student at <strong>{{user.sch}}</strong>,</div>
                    <div class="" v-if="user.is_student">Department of <strong>{{user.dept}}</strong></div>
                    <div class="mt-2 font-weight-bold primary--text">@{{user.username}}</div>
                  </v-card-text>

                  <v-card-actions class="mb-5">
                    <v-btn color="success" outlined small>{{followers_count || 0}} Followers</v-btn>
                    <v-btn color="success" outlined small>{{followings_count || 0}} Following</v-btn>

                    <template v-if="user.username != getUser.username">
                      <v-btn color="primary" class="ml-3" 
                        @click="follow" :disabled="disabled"
                        depressed small>
                        {{isFollowing ? 'Unfollow' : 'Follow'}}
                      </v-btn>
                    </template>

                  </v-card-actions>

                  <v-toolbar dense flat tabs color="grey lighten-3">
                    <v-toolbar-items>
                      
                      <template v-for="item in menuLinks">
                        <v-btn text
                          v-if="item.show"
                          :key="item.text" class="text-capitalize" 
                          active-class="primary--text" exact
                          :to="item.link"
                        >
                          {{item.text}}
                        </v-btn>
                      </template>
                      
                      
                    </v-toolbar-items>
                    
                      <v-spacer></v-spacer>
                      <v-menu offset-y v-if="isSameUser">
                        <template v-slot:activator="{on}">
                          <v-btn color="info" dark v-on="on" class="text-capitalize" v-if="isSuperUser && isSameUser">
                            <v-icon>mdi-plus-box</v-icon>
                            New
                          </v-btn>
                        </template>
                        <v-list dense>
                          <v-list-item @click="$router.push('/home')">
                            <v-list-item-title>Post</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="$eventBus.$emit('OpenNewManifestoDialog')">
                            <v-list-item-title>Manifesto</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="$eventBus.$emit('Toggle_New_Broadcast', true)">
                            <v-list-item-title>Broadcast</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="$eventBus.$emit('NewInteractive', true)">
                            <v-list-item-title>Event</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                  </v-toolbar>

                  <v-card class="grey lighten-5" outlined>
                    
                    <v-container class="grey lighten-4">
                      
                      <router-view/>

                    </v-container>

                  </v-card>
                </v-card>
              </v-col>

              <!-- MENU ITEMS -->
              

            </v-row>
          </v-container>

          <!-- CONTESTANTS INSIGHT -->
          <!-- <contestants-insight id="insyte" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></contestants-insight> -->
          
          <!-- PROFILE VIEWERS -->
          <!-- <profile-viewers id="p_views" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></profile-viewers> -->

        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data: ()=>({
    showUi: false,
    user:'', // users profile
    disabled: false, // disables the follow btn
    userRef: ''
  }),
  props:['username'],
  filters: {
    capitalize: function(v){
      return this.$helpers.capitalize(v)
    }
  },
  watch: {
    'username' (to, from) {
      // react to route changes...
      this.setUp()
    },
  },
  components:{
    Navigation,
    NewPost,
    ContestantsInsight,
    ProfileViewers,
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
    title(){
      return `${this.user.name} | ${this.$appName}` || 
      `Users | ${this.$appName}`
    },
    isSameUser(){
      return this.getUser.username == this.username
    },
    currentTab(){
      
      return this.$route.name
    },
    followers(){
      let arr = []
      this.$gun.get(this.user.username)
        .get('followers')
        .map()
        .on((f,key)=> {
          
          f ? arr.push(f) : ''
          console.log({f,key})
        })
      return uniqBy(arr, 'username')
    },
    followings(){
      let arr = []
      this.$gun.get(this.user.username)
        .get('following')
        .map()
        .on(fw => {
          arr.push(fw)
          console.log({fw})
        })
      return uniqBy(arr, 'username')
    },
    isFollowing(){
      let is_following = !!this.followers
      .find(f => f.username == this.getUser.username)
      console.log(is_following)
      return is_following
    },
    menuLinks(){
      let baseUrl =  `/users/${this.username}`
      return [
        {text: 'posts', link: `${baseUrl}/`, show: true},
        {text: 'followers', link: `${baseUrl}/followers/`, show: true},
        // {text: 'following', link: `${baseUrl}/following/`, show: true},
        {text: 'events', link: `${baseUrl}/events/`, show: true},
        {text: 'manifestos', link: `${baseUrl}/manifestos/`, show: this.isSameUser},
        {text: 'stats', link: `${baseUrl}/stats/`, show: this.isSameUser},
        // {text: 'Subscription', link: `${baseUrl}/subscription`, show: this.isSameUser}
      ]
    },
    options () {
      return {
        duration: 2000,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    },
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom'
    ]),
  },
  methods:{
    async follow(){
      this.disabled = true

      this.$helpers.followUser(this.getUser, this.user)
      .then(data =>{
        this.disabled = false
        
        // if(data.following){
        //   this.followers = this.followers + 1
        //   this.isFollowing = true

        // }
        // else{
        //   this.followers = this.followers - 1
        //   this.isFollowing = false
        // }
      })
      .catch(err => {
        // console.log(err)
      })
    },
    async checkFollowing(){

      let docId = `${this.getUser.username}-${this.user.username}-fol`
      let followerRef = db.collection('ufollowers').doc(docId)
      let isFollowing = followerRef.get()
        .then(doc =>{
          return doc.exists
        }).catch(err => false)
      
      this.isFollowing = await isFollowing
      
    },
    async setUp(){
      try {

        this.showUi = false

        let username = this.username

        this.$gun.get(username)
        .on(u => {
          if(u){
            // console.log(u)
            this.user = u
            this.$store.dispatch('curProfile', u)
            this.showUi = true
          }
          else{
            console.log('not found')
            this.$router.push('/notFound')
          }
        })

        // this.checkFollowing()


        if(!this.isSameUser){

          // await this.$helpers.profileViewsCounter(this.getUserInfo, this.user)
        }
        

      } catch (error) {
        // console.log(error)
        if(error){}
      }
    }
  },
  async created(){
    try {

      this.setUp()

      this.$eventBus.$on('Create_Broadcast_Resp', (data)=>{
        this.broadcasts.push(data)
      })

    } catch (error) {
      // console.log(error)
    }
    
  },
  beforeDestroy(){
    
    // this.userRef ? this.userRef() : ''
  }
}
  //import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
  import Navigation from '@/components/Navigation'
  import NewPost from '@/components/profile/NewPost'
  import ContestantsInsight from '@/components/elections/ContestantsInsight'
  import ProfileViewers from '@/components/elections/ProfileViewers'
  import { uniqBy } from "lodash";

</script>

<style lang="scss" >

</style>
