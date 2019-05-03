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
          <v-flex xs12 sm3>
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
                    <span v-else class="d-block white--text display-2" style="padding-top: 30px;">{{user.name.charAt(0)}}</span>
                  </v-avatar>
                </v-avatar>
              </v-sheet>

              <v-card-text class="text-xs-center " style="margin-top: 65px;">
                <span class="title text-capitalize">{{user.name}}</span>
                <span class="online_badge" :class="user.online ? 'success' : 'orange'"></span>
                <div class="" v-if="user.is_student">Student at <strong>{{user.sch}}</strong>,</div>
                <div class="" v-if="user.is_student">Department of <strong>{{user.dept}}</strong></div>
              </v-card-text>
              <v-card-actions class="justify-center" >
                <template v-if="user.uid != getUser.uid">
                  <!-- <v-btn color="purple" class="round" v-if="isSuperUser"
                    @click="$eventBus.$emit('Open_Private_Chat_Window',user)">
                    Message
                  </v-btn> -->
                  <v-btn color="secondary" class="round" @click="''">
                    {{user.followers}} Followers
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
          <v-flex xs12 sm9 d-flex>
            <v-card :class="{'round_top': $vuetify.breakpoint.smAndUp}" :flat="$vuetify.breakpoint.xsOnly" style="min-height: 400px;">
              <v-toolbar dense flat card tabs color="grey lighten-3">
                <v-tabs v-model="model"
                  color="grey lighten-3"
                  slider-color="yellow"
                >
                  <v-tab 
                    v-for="item in ['overview', 'posts']"
                    :key="item"
                    :href="`#${item}`"
                  >
                    {{ item }}
                  </v-tab>
                </v-tabs>
                <!-- <v-subheader class="pl-0 mt-0 font-weight-bold">Recent Posts</v-subheader>
                <v-spacer></v-spacer>
                <v-btn color="success" icon small v-if="getUser.email == $route.params.email && isSuperUser" depressed @click="new_post_dialog = true">
                  <v-icon>add</v-icon>
                </v-btn>
                <v-btn color="success" icon small v-if="getUser.email == $route.params.email && !isSuperUser" depressed @click="$eventBus.$emit('Show_Upgrade_Dialog', {from:'new_post'})">
                  <v-icon>add</v-icon>
                </v-btn> -->
              </v-toolbar>

              <v-container grid-list-md>
                <v-tabs-items v-model="model">

                  <v-tab-item value="overview" >
                    <v-card flat style="border: 1px solid #eee;">
                      <v-card-text >
                        <v-sparkline
                          :fill="true"
                          :auto-draw="false"
                          :gradient="gradients[3]"
                          :line-width="2"
                          :padding="1"
                          :smooth="10"
                          :value="[0, 2, 5, 9, 5, 10, 3, 5, 1, 2, 1, 8, 2, 9, 0]"
                          
                        ></v-sparkline>
                        <v-divider></v-divider>

                        <v-layout row wrap justify-center align-center>
                          <v-flex xs6 sm3 v-for="stat in stats" :key="stat.title">
                            <v-card class="text-xs-center" flat style="border: 1px solid #eee;" height="90">
                              
                              <v-list two-line class="">
                                <v-list-tile avatar>
                                  
                                  <v-list-tile-content>
                                    <v-list-tile-sub-title class="font-weight-bold">{{stat.title}}</v-list-tile-sub-title>
                                    <v-list-tile-title class="font-weight-bold">{{stat.value}}</v-list-tile-title>
                                  </v-list-tile-content>
                                  <v-list-tile-avatar >
                                    <v-icon large :color="stat.iconColor">{{stat.icon}}</v-icon>
                                  </v-list-tile-avatar>
                                </v-list-tile>
                                <!-- <v-subheader class="font-weight-light hidden-xs-only">{{stat.text}}</v-subheader> -->
                              </v-list>
                            </v-card>
                            
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                      
                    </v-card>
                  </v-tab-item>

                  <v-tab-item value="posts" >
                    <v-card flat>
                      <v-subheader v-if="posts.length == 0">No recent posts</v-subheader>
                      <v-layout row wrap class="navdrawr" style="height:300px;overflow:auto;">
                        <v-flex xs12 sm6 md4 v-for="(post,i) in posts" :key="i">
                          <v-card style="border:1px solid #ddd;" hover
                            class="round linkify" height="130" flat @click="viewPost(post)">
                            <v-card-text >
                              {{$helpers.truncateText(post.body, 90)}}
                            </v-card-text>
                            <v-card-actions style="position:absolute;bottom:0;">
                              
                              <v-icon color="secondary" class="ml-2" small>thumb_up</v-icon>
                              <span class="ml-2 mr-3">{{post.reactions}}</span>
                              
                            </v-card-actions>
                          </v-card>
                        </v-flex>
                      </v-layout>
                      <v-card-actions class="pl-4" v-if="limit_posts && posts.length >= 6">
                        <v-btn color="secondary" class="text-capitalize" flat depressed small :loading="loading" @click="seeMorePosts">See More</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>

                </v-tabs-items>

              </v-container>
              
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container grid-list-lg :pa-2="$vuetify.breakpoint.xsOnly">
        <v-subheader>Your Elections</v-subheader>

        <v-layout row wrap>
          <!-- ELECTIONS -->
          <v-flex xs12 sm4 d-flex>
            <v-card height="400" class="round_top">
              <v-tabs color="grey lighten-3" class="round_top" show-arrows slider-color="secondary">

                <v-tab href="#tab-1" class="text-capitalize" v-if="$route.params.email == getUser.email"> Managing </v-tab>

                <v-tab href="#tab-2" class="text-capitalize"> Contested </v-tab>

                <v-tab href="#tab-3" class="text-capitalize"> Enrolled</v-tab>

                <v-tab-item value="tab-1" v-if="$route.params.email == getUser.email">
                  <v-subheader v-if="myCreated.length == 0">You have not created any election yet</v-subheader>
                  <v-card flat>
                    <v-list two-line dense>
                      <template v-for="(election, i) in myCreated">
                        <v-list-tile avatar :key="election.electionId  + i" @click="'manage_dialog = true; managing = election.electionId'">
                          <v-list-tile-content>
                            <v-list-tile-title>{{election.title}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                              {{electionStatus(election)[0]}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="election.electionId  + i + 5"></v-divider>
                      </template>
                    </v-list>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-2">
                  <v-subheader v-if="myContests.length == 0">No contests</v-subheader>
                  <v-list two-line dense>
                    <template v-for="(election, i) in myContests" >
                      <v-list-tile avatar :key="election.electionId  + i" @click="''">
                        <v-list-tile-content>
                          <v-list-tile-title>{{election.title}}</v-list-tile-title>
                          <v-list-tile-sub-title>
                            <span class="online_badge" :class="[electionStatus(election)[1]]"></span>
                            {{electionStatus(election)[0]}}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <!-- <v-list-tile-action>
                          <v-menu offset-y>
                            <v-btn small icon depressed class="text-capitalize" dark slot="activator">
                              <v-icon color="grey">more_vert</v-icon>
                            </v-btn>
                            <v-list dense>
                              <v-list-tile @click="''">
                                <v-list-tile-title>Switch Election</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click="''">
                                <v-list-tile-title>Manage</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </v-list-tile-action> -->
                      </v-list-tile>
                      <v-divider :key="election.electionId  + i + myContests.length"></v-divider>
                    </template>
                  </v-list>
                </v-tab-item>

                <v-tab-item value="tab-3">
                  <v-subheader v-if="myEnrolled.length == 0">You have not enrolled any election yet</v-subheader>
                  <v-list two-line dense>
                    <template v-for="election in myEnrolled">
                      <v-list-tile avatar @click="''" :key="election.electionId + 'df'">
                        <v-list-tile-content>
                          <v-list-tile-title>{{election.title}}</v-list-tile-title>
                          <v-list-tile-sub-title>
                            <v-icon small :color="electionStatus(election)[1]">fiber_manual_record</v-icon>
                            {{electionStatus(election)[0]}}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="election.electionId  + 'as'"></v-divider>
                    </template>
                  </v-list>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-flex>

          <!-- FOLLOWERS -->
          <v-flex xs12 sm4 d-flex>
            <v-card class="round_top" height="400" >
              <v-subheader class="grey lighten-3 font-weight-bold">Followers</v-subheader>
              <v-subheader v-if="followers.length == 0">No followers</v-subheader>
              <v-list dense two-line v-for="follower in followers" :key="follower.uid">
                <v-list-tile avatar @click="$eventBus.$emit('ViewProfile', follower.onr)">
                  <v-list-tile-avatar :color="$helpers.colorMinder(follower.onr.name.charAt(0))" class="white--text">
                    <img :src="follower.onr.photoURL" v-if="follower.onr.photoURL">
                    <span v-else>{{follower.onr.name.charAt(0)}}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title >{{follower.onr.name | capitalize}}</v-list-tile-title>
                    <v-list-tile-sub-title :class="$helpers.colorMinder(follower.onr.name.charAt(0)) + '--text'">
                      {{$helpers.truncateText(follower.onr.dept)}} 
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  
                </v-list-tile>
                <v-divider inset></v-divider>
              </v-list>
              <v-card-actions>
                <v-btn color="secondary" flat small @click="moreFollowers" v-if="followers.length > 25 && user.followers > followers.length"
                  :loading="loading_more_followers" style="text-transform: initial">
                  See more
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <!-- MANIFESTOS -->
          <v-flex xs12 sm4 d-flex>
            <v-card class="round_top">
              <v-toolbar dense flat>
                <v-subheader class="pl-0 mt-0 font-weight-bold">MANIFESTOS</v-subheader>
                <v-spacer></v-spacer>
                
                <v-btn color="secondary" 
                  icon small v-if="canCreateManifesto" 
                  class="text-capitalize" 
                  @click="$eventBus.$emit('OpenNewManifestoDialog')">
                  <v-icon>add</v-icon>
                </v-btn>

                <v-btn color="secondary" 
                  icon small v-if="getUser.email == $route.params.email 
                    && !isSuperUser" 
                  class="text-capitalize" 
                  @click="$eventBus.$emit('Show_Upgrade_Dialog', {from:'new_manifesto'})"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text class="pa-0 navdrawr" style="max-height:310px;overflow:auto;">
                <v-list dense>
                  <v-subheader v-if="manifestos.length == 0">No manifestos</v-subheader>
                  <template v-for="(manifesto,i) in manifestos" >
                    <v-list-tile :key="i" @click="view_manifesto = true; viewManifesto(manifesto)">
                      <v-list-tile-content>
                        <v-list-tile-title v-html="manifesto.title"></v-list-tile-title>
                        <!-- <v-list-tile-sub-title v-text="manifesto.manifesto_text"></v-list-tile-sub-title> -->
                        <!-- <v-list-tile-sub-title>
                          <v-icon small color="red">favorite</v-icon> 56k
                        </v-list-tile-sub-title> -->
                        
                      </v-list-tile-content>
                      <v-list-tile-action>
                          
                        <v-dialog v-model="deleteDialog" persistent max-width="290" v-if="manifesto.onr.uid == getUser.uid">
                          <v-icon color="orange" small slot="activator" >delete</v-icon>
                          <v-card>
                            <v-card-title class=" red white--text headline">Delete Manifesto</v-card-title>
                            <v-card-text>Are you sure you want to delete this manifesto ?</v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="" flat @click.native="deleteDialog = false">Cancel</v-btn>
                              <v-btn color="orange" flat @click.native="deleteManifesto(manifesto)" :loading="deleting">Delete</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="`div-${i}`"></v-divider>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <!-- <v-btn color="success" flat v-if="manifestos.length > 4 " small class="text-capitalize" 
                  @click="getManifestos(5999); limit_manifestos = false;">
                  See More
                </v-btn> -->
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- CONTESTANTS INSIGHT -->
      <contestants-insight v-if="$route.params.email == getUser.email && isSuperUser"></contestants-insight>

      <!-- PROFILE VIEWERS -->
      <profile-viewers v-if="$route.params.email == getUser.email && isSuperUser"></profile-viewers>


      <!-- SNACKBAR -->
      <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top right>
        {{snackbar.message}}
        <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
      </v-snackbar>

      <!-- New Post Dialog -->
      <v-dialog
        v-model="new_post_dialog"
        scrollable lazy v-if="new_post_dialog"
        persistent :fullscreen='$vuetify.breakpoint.smAndDown'
        max-width="850px"
        transition="slide-x-transition">

        <new-post :user='getUserInfo' :myContests='myContests'></new-post>
      </v-dialog>

      <!-- VIEW POSTS -->
      <v-dialog v-model="view_post" lazy v-if="view_post"
        max-width="500" scrollable
        :transition="$vuetify.breakpoint.xsOnly ? 'slide-x-transition' : 'dialog-bottom-transition'" :fullscreen="$vuetify.breakpoint.xsOnly">
        <v-card :style="viewPostStyle">

          <v-list two-line dark dense class="teal">
            <v-list-tile avatar>
              <v-list-tile-action class="hidden-sm-and-up" style="min-width:30px;">
                <v-btn flat icon @click="view_post = false">
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-avatar :color="$helpers.colorMinder(user.name.charAt(0))">
                <img :src="user.photoURL" v-if="user.photoURL"/>
                <span v-else>{{user.name.charAt(0)}}</span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-capitalize">{{user.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{$helpers.parseDate(cur_post.tstamp,true)}}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="view_post = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>

          <v-card-text style="padding-bottom: 70px">
            {{cur_post.body}}
            <v-container grid-list-sm class="px-1" v-if="cur_post.imgs.length > 0">
              <v-layout row wrap>
                <v-flex v-for="(image,i) in cur_post.imgs.slice(0,3)" :key="i" class="px-2" 
                  :class="{'xs3': cur_post.imgs.length >=3,'xs6': cur_post.imgs.length < 3}">
                  <v-card dark max-height="500px" :height="cur_post.imgs.length == 1 ? '70%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" class="mb-3">
                    <v-img :src="image" :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" 
                      alt="" class="grey lighten-2 linkify" height="100%" width="100%"
                      @click="carouselDialog(cur_post.imgs,i)">
                      
                      <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-card>
                </v-flex>
                <v-flex xs3>
                  <v-card  v-if="cur_post.imgs.length >= 4" 
                    :height="cur_post.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" 
                    class="mb-3 linkify" dark @click="carouselDialog(cur_post.imgs, 3)">
                    <div class="title text-xs-center" style="padding-top: 55%;">+ {{cur_post.imgs.length - 3}} more</div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions  :style="viewPostAction" class="grey lighten-3">
            <v-btn color="blue darken-1" flat @click="likePost(cur_post)" :disabled="disabled_like">
              {{cur_post.reactions ? cur_post.reactions : 0}} Likes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- VIEW MANIFESTO -->
      <v-dialog v-model="view_manifesto" content-class="white view_dialog"
        v-if="view_manifesto" max-width="500" lazy scrollable :transition="$vuetify.breakpoint.xsOnly ? 'slide-x-transition' : 'dialog-bottom-transition'"
          :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen">
        <v-card style="min-height: 450px;">
          <v-list dense dark :class="[$helpers.colorMinder(viewing.onr.name.charAt(0))]">
            <v-list-tile avatar>
              <v-list-tile-action class="hidden-sm-and-up" style="min-width: 30px;">
                <v-btn flat icon @click="view_manifesto = false">
                  <v-icon>chevron_left</v-icon>
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
                  <v-icon>fullscreen</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="view_manifesto = false">
                  <v-icon>close</v-icon>
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
      </v-dialog>
    </template>
  </div>
</template>
<script>
export default {
  data:()=>({
    model:'overview',
    ready:false,
    snackbar: {},
    follower_tab:1,
    user:'', // users profile
    carousel_dialog: false,
    carousel_images: {},
    onboarding: 0,
    deleteDialog: false,
    deleting: false,
    view_post: false,
    limit_posts: true,
    offset: 6,
    followers_offset: 25,
    loading_more_followers: false,
    postsRef: '',
    manifestoRef: '',
    limit_manifestos: true,
    loading: false,
    fullscreen: false,
    cur_post: {},
    new_post_dialog: false,
    manage_dialog: false,
    managing: '',
    manifestos: [],
    view_manifesto: false,
    viewing: {},
    new_manifesto: false,
    post_likes: null,
    gradients: [
      ['#222'],
      ['#42b3f4'],
      ['red', 'orange', 'yellow'],
      ['purple', 'violet'],
      ['#00c6ff', '#F0F', '#FF0'],
      ['#f72047', '#ffd200', '#1feaea']
    ],
    about_user:[
      'name','email','phone','school','faculty','department'
    ],
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    followers_id_list:[],
    myElections:[],
    myCreated:[],
    myContests:[],
    myEnrolled:[],
    broadcasts:[],
    posts:[],
    followers: [],
    disabled: false, // disables the follow btn
    disabled_like: false, // disables the like btn
    user_tabs_model:'overview'
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
    }
  },
  components:{
    Navigation,
    ElectionManager,
    NewPost,
    ContestantsInsight,
    ProfileViewers,
    LoadingBar
    // NewManifesto
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
      return this.user.name + ' | Facevote' || 
      'Users | Facevote'
    },
    menuItems(){
      return [
        {title:'Overview',link: `/profile`},
        {title: 'Bookings', link: `/profile/bookings`},
        {title: 'Reviews', link: `/profile/reviews`, hideXs: true},
        {title: 'Settings', link: `/profile/settings`, hideXs: true},
        {title: 'Add your property', link: `/add-your-property`, hideXs: true}
      ]
    },
    stats(){
      return [
        {title:'Followers', value: this.user.followers.toLocaleString(), icon: 'lens',iconColor:'secondary'},
        {title:'Contests', value: this.myContests.length.toLocaleString(), icon:'group', iconColor:'purple'},
        {title:'Elections', value: this.myCreated.length.toLocaleString(), icon: 'hdr_strong', iconColor:'success'},
        {title:'Posts', value: this.posts.length.toLocaleString(), icon: 'equalizer', iconColor: 'cyan'}
      ]
    },
    lowercase(val){
      return val.toUpperCase
    },
    canCreateManifesto(){
      return this.getUser.email == this.$route.params.email && 
      this.isSuperUser && 
      !this.manifestos.find(manifesto => manifesto.docId == this.curRoom.electionId + '-' + this.getUser.uid)
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
      'getUserInfo',
      'getToken',
      'isAuthenticated'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ]),
    isFollowing(){
      let found = this.user.followers.find(uid => uid == this.getUser.uid)
      // console.log(found)
      return found ? true : false
    }
  },
  methods:{
    async follow(){
      if(this.user.followers.indexOf(this.getUser.uid) == -1){
        // not following user, follow this user
        this.disabled = true
        this.user.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(this.user.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayUnion(this.user.uid)
          })
          this.disabled = false
        })
      }
      else{
        // is following the user, unfollow
        this.disabled = true
        this.user.followers.splice(this.user.followers.indexOf(this.getUser.uid),1)
        db.collection('moreUserInfo').doc(this.user.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayRemove(this.user.uid)
          })
          this.disabled = false
        })
      }
    },
    electionStatus(election){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE

      let start = new Date(election.startDate + ' ' + election.startTime).getTime();
      let one_hour = 1000 * 60 * 60
      if(start > Date.now()){
        return ['Not Started', 'secondary'] // not started
      }
      else if(start + election.duration * one_hour > Date.now()){
        return ['In Progress', 'success'] // in progress
      }
      else{
        return ['Ended','error'] // ended
      }
      
    },
    deleteManifesto(manifesto){
      let docRef = db.collection('manifestos')
      .doc(`${this.getUser.uid}-${this.curRoom.electionId}-man`)
      
      this.deleting = true
      docRef.delete().then(d=>{
        this.snackbar = {
          show: true,
          message: 'Manifesto deleted',
          color: 'dark'
        }
        this.deleteDialog = false
        this.deleting = false
      }).catch(err => {
        // console.log(err)
      })
    },
    async getCreated(){
      // election user created or is managing (is admin)
      let elecRef = db.collection('elections')
      let myArr = []
      elecRef.where('admins','array-contains',this.user.uid)
      .get().then(doc=>{
        myArr = []
        doc.forEach(item=>{
          //console.log(item.id, " => ", item.data());
          myArr.push(item.data())
        })
        this.myCreated = myArr
      })
    },
    async getContested(){
      let elecs = []
      if(this.user.contests){

        this.user.contests.forEach(async contest =>{
          let doc  = await db.collection('elections').doc(contest).get()
          doc.exists ? elecs.push(doc.data()) : ''
        })
      }
      
      this.myContests = elecs.sort((a,b) => b.dateCreated.toMillis() - a.dateCreated.toMillis())
    },
    async getEnrolled(){
    
      let arr = []
      if(this.user.enrolled){

        for(const electionId of this.user.enrolled){
          // console.log(electionId)
          let doc = await db.collection('elections').doc(electionId).get()
          doc.exists ? arr.push(doc.data()) : ''
        }
      }
      this.myEnrolled = arr.sort((a,b) => b.dateCreated.toMillis() - a.dateCreated.toMillis())
    },
    likeManifesto(manifesto){
      // console.log(manifesto, this.getUser.uid)
      if(manifesto.likes && manifesto.likes.find(id => id == this.getUser.uid)){
        // console.log('liked')
        db.collection('manifestos').doc(manifesto.docId)
        .update({
          likes:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        })
      }
      else{
        // console.log('not liked')
        db.collection('manifestos').doc(manifesto.docId)
        .update({
          likes:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        })
      }
      
    },
    likePost(post){
      this.disabled_like = true
      this.$helpers.likePost(this.getUserInfo, post).then(done =>{
        this.disabled_like = false
        
        if(done.reacted){
          post.reactions++
        }
        if(!done.reacted){
          post.reactions--
        }
      })
      
    },
    viewPost(post){
      //console.log(post.id)
      this.cur_post = post
      this.view_post = true;
      
    },
    viewManifesto(manifesto){
      // console.log(manifesto.docId)
      this.viewing = manifesto
      this.view_manifesto = true
      
    },
    async seeMorePosts(){
      this.loading = true
     
      db.collection('posts').where('onr.uid','==',this.user.uid)
      .startAfter(this.offset)
      .limit(25).get().then(querySnapshot =>{
        
        querySnapshot.forEach(doc => {
          this.posts.push(doc.data())
        });
        this.offset = querySnapshot.docs[querySnapshot.docs.length-1];

        this.posts = this.posts.sort((a,b)=> b.tstamp - a.tstamp)
        this.limit_posts = false
        this.loading = false
      }).catch(err => {
        // console.log(err)
      })
      
    },
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
    async getManifestos(){
      this.manifestoRef = db.collection('manifestos').where('onr.uid','==',this.user.uid)
      .onSnapshot(querySnapshot=>{
        let manifestos = []
        querySnapshot.forEach(doc => {
          manifestos.push(doc.data())
        });
        this.manifestos = manifestos
        //console.log(this.manifestos)
      }, err=>{
        // console.log(err)
      })
    },
    async getUserPosts(){
      this.postsRef = db.collection('posts').where('onr.uid','==',this.user.uid)
      .limit(6)
      .onSnapshot(querySnapshot=>{
        let posts = []
        this.offset = querySnapshot.docs[querySnapshot.docs.length-1];
        querySnapshot.forEach(doc => {
          posts.push(doc.data())
        });
        this.posts = posts.sort((a,b)=> b.tstamp - a.tstamp)
        //console.log(this.posts)
      }, err=>{
        // console.log(err)
      })
    },
    moreFollowers(){
      this.loading_more_followers = true
      db.collection('ufollowers').where('followee','==',this.user.uid)
      .startAfter(this.followers_offset)
      .limit(25).get().then(querySnapshot =>{
        
        querySnapshot.forEach(doc => {
          this.followers.push(doc.data())
        });
        this.followers_offset = querySnapshot.docs[querySnapshot.docs.length-1];

        this.loading_more_followers = false
      }).catch(err => {
        // console.log(err)
      })
    },
    async getFollowers(){
      return db.collection('ufollowers')
      .where('followee','==',this.user.uid)
      .limit(25)
      .get().then(querySnapshot=>{
        let arr = []
        querySnapshot.forEach(doc=>{
          arr.push(doc.data())
        })
        this.followers_offset = querySnapshot.docs[querySnapshot.docs.length-1];
        this.followers = arr
        // console.log(arr)
        return arr
      })
    },
    async setUp(){
      try {
        this.ready = false
        this.limit = 25

        if(this.$route.params.email == this.getUser.email && this.getUserInfo){
          this.user = this.getUserInfo
          
          await this.getUserPosts(this.offset)
          await this.getFollowers()
          this.ready = true

          this.getCreated();
          this.getContested()
          this.getEnrolled()
          this.getManifestos()
        }
        
        else{
          db.collection('moreUserInfo')
          .where('email', '==', this.$route.params.email)
          .get().then(async querySnapshot =>{
            if(querySnapshot.docs.length > 0){
              let res = []
              querySnapshot.forEach(doc =>{
                res.push(doc.data())
              })
              this.user = res[0]

              await this.getUserPosts(this.offset)
              await this.getFollowers()
              this.ready = true

              this.getCreated();
              this.getContested()
              this.getEnrolled()
              this.getManifestos(4)
              if(this.$route.params.email != this.getUser.email){

                await this.$helpers.profileViewsCounter(this.getUserInfo, this.user)
              }
            }
            else{
              this.$router.push('/notFound')
            }
          })
          
         
        }

        

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
    this.postsRef()
    this.manifestoRef()
  }
}
  //import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
  import Navigation from '@/components/Navigation'
  import ElectionManager from '@/components/manager/Manager__overview'
  import NewPost from '@/components/profile/NewPost'
  import ContestantsInsight from '@/components/ContestantsInsight'
  import ProfileViewers from '@/components/ProfileViewers'
  import LoadingBar from '@/spinners/LoadingBar'
  //import NewManifesto from '@/components/profile/NewManifesto'

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
