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
          <v-container :grid-list-md="$vuetify.breakpoint.smAndUp" :pa-0="$vuetify.breakpoint.xsOnly">
            <v-layout row wrap>

              <!-- PROFILE -->
              <v-flex xs12 md3>
                <v-card :class="{round_top: $vuetify.breakpoint.smAndUp}" height="420">
                  <v-sheet flat width="100%" height="120" :color="$helpers.colorMinder(user.name.charAt(0)) + ' lighten-3'">

                  </v-sheet>
                  <v-sheet flat width="61%" height="124" style="position: absolute;top: 55px;left: 20%;" color="transparent">
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

                  <v-card-text class="text-xs-center " style="margin-top: 65px;">
                    <span class="title text-capitalize">{{user.name | capitalize}}</span>
                    <v-tooltip right>
                      <v-icon color="success" style="font-size: 20px" slot="activator" v-if="is_verified">mdi-check-decagram</v-icon>
                      <span>User is verified</span>
                    </v-tooltip> 
                    <!-- <span class="online_badge" :class="user.online ? 'success' : 'orange'"></span> -->
                    <div class="" v-if="user.is_student">Student at <strong>{{user.sch}}</strong>,</div>
                    <div class="" v-if="user.is_student">Department of <strong>{{user.dept}}</strong></div>
                    <div class="mt-2 font-weight-bold secondary--text">@{{user.username}}</div>
                  </v-card-text>
                  <div class="text-xs-center">{{followers.toLocaleString() || 0}} Followers</div>
                  <v-card-actions class="justify-center" >
                    <template v-if="user.uid != getUser.uid">
                      <v-btn color="secondary" class="ml-3" @click="follow" :disabled="disabled">
                        {{isFollowing ? 'Unfollow' : 'Follow'}}
                      </v-btn>
                    </template>
                    <v-btn v-else class="round" color="success"
                      @click="$eventBus.$emit('show_profile_settings')">
                      Edit Profile
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>

              <!-- MENU ITEMS -->
              <v-flex xs12 md9 d-flex>
                <v-card class="grey lighten-5" 
                :class="{'round_top': $vuetify.breakpoint.smAndUp}" 
                :flat="$vuetify.breakpoint.xsOnly" style="min-height: 400px;">
                  
                  <v-toolbar dense flat card tabs color="grey lighten-3">
                    <v-toolbar-items>
                      
                      <template v-for="item in menuLinks">
                        <v-btn flat
                          v-if="item.show"
                          :key="item.text" class="text-capitalize" 
                          active-class="secondary" exact
                          :to="item.link"
                        >
                          {{item.text}}
                        </v-btn>
                      </template>
                      
                      
                    </v-toolbar-items>
                    
                      <v-spacer></v-spacer>
                      <v-menu offset-y v-if="isSameUser">
                        <v-btn color="info" dark slot="activator" class="text-capitalize" v-if="isSuperUser && isSameUser">
                          <v-icon>mdi-plus-box</v-icon>
                          New
                        </v-btn>
                        <v-list dense>
                          <v-list-tile @click="$router.push('/home')">
                            <v-list-tile-title>Post</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="$eventBus.$emit('OpenNewManifestoDialog')">
                            <v-list-tile-title>Manifesto</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="$eventBus.$emit('Toggle_New_Broadcast', true)">
                            <v-list-tile-title>Broadcast</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="$eventBus.$emit('NewInteractive', true)">
                            <v-list-tile-title>Event</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>

                  </v-toolbar>
                  
                  <v-container grid-list-md class="grey lighten-4">
                    
                    <router-view/>

                  </v-container>

                </v-card>
              </v-flex>

            </v-layout>
          </v-container>

          <!-- CONTESTANTS INSIGHT -->
          <contestants-insight id="insyte" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></contestants-insight>
          
          <!-- PROFILE VIEWERS -->
          <profile-viewers id="p_views" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></profile-viewers>

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
    isFollowing: false,
    disabled: false, // disables the follow btn
    userRef: ''
  }),
  props:['userId'],
  filters: {
    capitalize: function(v){
      return this.$helpers.capitalize(v)
    }
  },
  watch: {
    'userId' (to, from) {
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
      return this.getUser.uid == this.userId
    },
    currentTab(){
      
      return this.$route.name
    },
    menuLinks(){
      let baseUrl =  `/users/${this.userId}`
      return [
        {text: 'posts',link: `${baseUrl}/`, show: true},
        {text: 'events',link: `${baseUrl}/events/`, show: true},
        {text: 'followers',link: `${baseUrl}/followers/`, show: true},
        {text: 'manifestos',link: `${baseUrl}/manifestos/`, show: true},
        {text: 'stats',link: `${baseUrl}/stats/`, show: this.isSameUser},
        {text: 'Subscription', link: `${baseUrl}/subscription`, show: this.isSameUser}
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
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom'
    ]),
    followers: {
      get: function(){
        return this.user.followers || 0
      },
      set: function(newVal){
        return newVal
      }
    },
  },
  methods:{
    async follow(){
      this.disabled = true

      this.$helpers.followUser(this.getUserInfo, this.user)
      .then(data =>{
        this.disabled = false
        
        if(data.following){
          this.followers = this.followers + 1
          this.isFollowing = true

        }
        else{
          this.followers = this.followers - 1
          this.isFollowing = false
        }
      })
      .catch(err => {
        // console.log(err)
      })
    },
    async checkFollowing(){

      let docId = `${this.getUserInfo.uid}-${this.user.uid}-fol`
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

        let userRef = db.collection('moreUserInfo')
        .doc(this.userId)
        .onSnapshot( async doc =>{

          if(doc.exists){
            
            this.$store.dispatch('curProfile', doc.data())
            this.user = doc.data()

            this.showUi = true
            this.checkFollowing()


            if(!this.isSameUser){

              await this.$helpers.profileViewsCounter(this.getUserInfo, this.user)
            }
          }
          else{
            this.$router.push('/notFound')
          }
        })

      } catch (error) {
        // console.log(error)
        if(error){}
      }
    }
  },
  mounted(){
    
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
    
    this.userRef ? this.userRef() : ''
  }
}
  //import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
  import Navigation from '@/components/Navigation'
  import NewPost from '@/components/profile/NewPost'
  import ContestantsInsight from '@/components/elections/ContestantsInsight'
  import ProfileViewers from '@/components/elections/ProfileViewers'
  import {firebase, db, database} from '@/plugins/firebase'

</script>

<style lang="scss" >
@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
@mixin borderTopRadius($radius) {
  border-top-right-radius: $radius;
  -webkit-border-top-right-radius:$radius;
  -moz-border-top-right-radius:$radius;
  -o-border--top-right-radius:$radius;
  border-top-left-radius: $radius;
  -webkit-border-top-left-radius:$radius;
  -moz-border-top-left-radius:$radius;
  -o-border--top-left-radius:$radius;
}
.round_top{
  @include borderTopRadius(10px);
}

$mainBgColor:#1c1f35;

.wireframe::after{
  content: '';
  position: absolute;
  width: 40%;
  height: 12px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255,255,255, 15%), rgba(0, 0, 0, 0));
  transform: translateX(-10%);
  animation: loading 1.5s infinite;
}

/* --scrollbar --*/
.scrollbar::-webkit-scrollbar {
    width: 10px;
    background-color: #d7d7df ;
    @include borderRadius(5px)
  }
.scrollbar::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #d7d7df ;
  @include borderRadius(5px)
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(5px);
}
</style>
