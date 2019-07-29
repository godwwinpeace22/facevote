<template>
  <div>
    <vue-headful :title="title | capitalize"/>

    <navigation>
      <span slot="title">Profile</span>
    </navigation>

    <!-- LOADING WIREFRAME -->

    <loading-bar v-if="!ready">
      <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
    </loading-bar>

    <template v-else>
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
                  <v-icon color="success" slot="activator" v-if="is_verified">mdi-check-decagram</v-icon>
                  <span>User is verified</span>
                </v-tooltip> 
                <!-- <span class="online_badge" :class="user.online ? 'success' : 'orange'"></span> -->
                <div class="" v-if="user.is_student">Student at <strong>{{user.sch}}</strong>,</div>
                <div class="" v-if="user.is_student">Department of <strong>{{user.dept}}</strong></div>
                <div class="mt-2 font-weight-bold secondary--text">@{{user.username}}</div>
              </v-card-text>
              <v-card-actions class="justify-center" >
                <template v-if="user.uid != getUser.uid">
                  
                  <v-btn color="secondary" class="round" @click="''">
                    {{user.followers || 0}} Followers
                  </v-btn>
                </template>
                <v-btn v-else class="round" color="success"
                  @click="$eventBus.$emit('show_profile_settings')">
                  Edit Profile
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <!-- OVERVIEW, POSTS -->
          <v-flex xs12 md9 d-flex>
            <v-card class="grey lighten-5" 
            :class="{'round_top': $vuetify.breakpoint.smAndUp}" 
            :flat="$vuetify.breakpoint.xsOnly" style="min-height: 400px;"
          >
              
              <v-toolbar dense flat card tabs color="grey lighten-3">
                <v-toolbar-items>
                  
                  <template v-for="item in menuLinks">
                    <v-btn flat
                      v-if="item.show"
                      :key="item.text" class="text-capitalize" 
                      :class="{secondary: item.text == currentTab}"
                      @click.native="currentTab = item.text;"
                    >
                      {{item.text}}
                    </v-btn>
                  </template>
                  
                  
                </v-toolbar-items>
                <!-- <v-tabs v-model="model"
                  color="grey lighten-3"
                  slider-color="yellow">
                  <v-tab 
                    v-for="item in ['posts','followers']"
                    :key="item"
                    :href="`#${item}`"
                    class="text-capitalize"
                  >
                    {{ item }}
                  </v-tab>
                  <v-tab href="#manifestos" class="text-capitalize hidden-xs-only">
                    manifestos
                  </v-tab>
                  <v-tab href="#stats" class="text-capitalize hidden-xs-only">
                    Stats
                  </v-tab>
                  <v-tab href="#events" class="text-capitalize hidden-lg-and-down">
                    Events
                  </v-tab>

                  <v-menu offset-y >
                    <v-btn color="" flat slot="activator" class="text-capitalize font-weight-light">
                      more
                      <v-icon>$vuetify.icons.expand</v-icon>
                    </v-btn>
                    <v-list dense>
                      <v-list-tile class="hidden-sm-and-up" @click="model = 'manifestos'">
                        <v-list-tile-title>Manifestos</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile class="hidden-md-and-up" @click="model = 'stats'">
                        <v-list-tile-title>Stats</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile class="" @click="model = 'events'">
                        <v-list-tile-title>Events</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-tabs> -->


                  <!-- <v-btn color="success" outline dark flat class="text-capitalize hidden-sm-and-down"
                    @click="$vuetify.goTo('#insyte', options)"
                    v-if="isSameUser && isSuperUser">
                    Insight
                  </v-btn>
                  <v-btn color="success" outline flat class="text-capitalize hidden-sm-and-down"
                    @click="$vuetify.goTo('#p_views', options)"
                    v-if="isSameUser && isSuperUser">
                    Profile Viewers
                  </v-btn> -->

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
                <loading-bar v-if="loading_components">
                  <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
                </loading-bar>
                <component v-else v-bind:is="currentTab" :user="user" ></component>
              </v-container>

            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- CONTESTANTS INSIGHT -->
      <contestants-insight id="insyte" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></contestants-insight>
      
      <!-- PROFILE VIEWERS -->
      <profile-viewers id="p_views" v-if="isSameUser && isSuperUser && currentTab == 'stats'"></profile-viewers>


      <!-- SNACKBAR -->
      <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top right>
        {{snackbar.message}}
        <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
      </v-snackbar>

      <!-- New Post Dialog -->
      <!-- <v-dialog
        v-model="new_post_dialog"
        scrollable lazy v-if="new_post_dialog"
        persistent :fullscreen='$vuetify.breakpoint.smAndDown'
        max-width="850px"
        transition="slide-x-transition">

        <new-post :user='getUserInfo' :myContests='myContests'></new-post>
      </v-dialog> -->

      <!-- VIEW MANIFESTO -->
      <!-- <v-dialog v-model="view_manifesto" content-class="white view_dialog"
        v-if="view_manifesto" max-width="500" lazy scrollable :transition="$vuetify.breakpoint.xsOnly ? 'slide-x-transition' : 'dialog-bottom-transition'"
          :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen">
        <v-card style="min-height: 450px;">
          <v-list dense dark :class="[$helpers.colorMinder(viewing.onr.name.charAt(0))]">
            <v-list-tile avatar>
              <v-list-tile-action class="hidden-sm-and-up" style="min-width: 30px;">
                <v-btn flat icon @click="view_manifesto = false">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-avatar :color="!user.photoURL ? user.name.charAt(0) : ''">
                <img v-if="user.photoURL" :src="user.photoURL">
                <span v-else class="white--text">{{user.name.charAt(0)}}</span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-capitalize">{{user.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{$helpers.parseDate(viewing.tstamp)}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="fullscreen = !fullscreen">
                  <v-icon>{{fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'}}</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="view_manifesto = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>

          <v-card-text>
            <v-container grid-list-xs>
              <v-layout row wrap justify-center>
                <v-flex shrink>
                  <v-card flat class="grey lighten-5 pa-3">
                    <div v-html="viewing.body"></div>
                    
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog> -->
    </template>
  </div>
</template>
<script>
export default {
  data: ()=>({
    model:'posts',
    show: false,
    ready: false,
    currentTab: 'posts',
    loading_components: false,
    snackbar: {},
    follower_tab:1,
    user:'', // users profile
    cur_post: {},
    new_post_dialog: false,
    manage_dialog: false,
    managing: '',
    posts:[],
    disabled: false, // disables the follow btn
    disabled_like: false, // disables the like btn
  }),
  props:['username'],
  filters: {
    capitalize: function(v){
      return this.$helpers.capitalize(v)
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.setUp()
    },
  },
  components:{
    Navigation,
    NewPost,
    ContestantsInsight,
    ProfileViewers,
    Posts,
    Events,
    Followers,
    Manifestos,
    Stats,
    LoadingBar
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
      return this.getUserInfo.uid == this.user.uid
    },
    menuLinks(){
      return [
        {text: 'posts', show: true},
        {text: 'events', show: true},
        {text: 'followers', show: true},
        {text: 'manifestos', show: true},
        {text: 'stats', show: this.isSameUser}
      ]
    },
    options () {
      return {
        duration: 2000,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    },
    lowercase(val){
      return val.toUpperCase
    },
    viewPostStyle(){
      return this.$vuetify.breakpoint.smAndUp ?
      {minHeight: '400px'} : {minHeight: 'calc(100vh - 3px'}
    },
    viewPostAction(){
      return {position: 'absolute', bottom: '0px', width: '100%'}
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
    isFollowing(){
      let found = this.user.followers.find(uid => uid == this.getUser.uid)
      // console.log(found)
      return found ? true : false
    },
  },
  methods:{
    async follow(){
      this.disabled = true

      this.$helpers.followUser(this.getUserInfo, this.user)
      .then(data =>{
        this.disabled = false
        // console.log(this.$refs)
        if(data.following){
          this.user.followers += 1

          // this.$refs[contestant.uid][0].innerText = `You are following ${contestant.name}`
        }
        else{
          this.user.followers -= 1
          // this.$refs[contestant.uid][0].innerText = `Follow ${contestant.name}`
        }
      })
      .catch(err => {
        // console.log(err)
      })
    },
    async setUp(){
      try {

        console.log('Running Setup')

        db.collection('moreUserInfo')
        .where('username', '==', this.$route.params.username)
        .get().then(async querySnapshot =>{
          if(querySnapshot.docs.length > 0){
            let res = []
            querySnapshot.forEach(doc =>{
              res.push(doc.data())
            })
            this.user = res[0]
           
            this.ready = true

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
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.new_post_dialog = false
    })

    this.$eventBus.$on('LoadedComp', data => {
      this.loading_components = false
    })
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
    // remove firebase query listeners
    this.postsRef ? this.postsRef() : ''
    // this.manifestoRef ? this.manifestoRef() : ''
  }
}
  //import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
  import Navigation from '@/components/Navigation'
  import NewPost from '@/components/profile/NewPost'
  import ContestantsInsight from '@/components/ContestantsInsight'
  import ProfileViewers from '@/components/ProfileViewers'
  import LoadingBar from '@/spinners/LoadingBar'
  import Posts from '@/components/users/Users__Posts'
  import Events from '@/components/users/Users__Events'
  import Followers from '@/components/users/Users__Followers'
  import Manifestos from '@/components/users/Users__Manifestos'
  import Stats from '@/components/users/Users__Stats'
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
