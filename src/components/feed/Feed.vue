<template>
  <div class="bgd">
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">Home</span>
    </navigation>

    
    <!-- Events -->
    <v-navigation-drawer width='250' right hide-overlay clipped app class="bgd">
      <v-subheader class="font-weight-bold">Events</v-subheader>
      <v-container grid-list-xs px-2 py-1>
        <v-row row wrap>
          <v-col cols="12">
            <!-- <list-events/> -->
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <transition name="fade" mode="out-in">
      <!-- LOADING WIREFRAME -->
      <v-container v-if="!ready" fluid>
        <v-row row wrap justify="space-between">
          <v-col cols="12" sm="12" md="4" order-md2>
            <v-card :height="breakpoint.smAndDown ? 150 : 400" flat class="elevation-0" elevation-0>
              <v-list two-line dense>
                <v-list-item >
                  <v-list-item-avatar>
                    
                    <v-avatar color="grey lighten-3" size="40" tile>
                      
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content class="px-0">
                    <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                    <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="7" >
            <v-card  v-for="(post,i) in 2" :key="i" flat
              height="250" class="mb-3 pb-2">
              
              <v-list two-line dense>
                <v-list-item >
                  <v-list-item-avatar>
                    
                    <v-avatar color="grey lighten-3" size="40">
                      
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content class="px-0">
                    <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                    <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <div class="grey lighten-3 wireframe mx-3 mb-3 mt-4" style="width:70%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:90%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:50%;height:12px;"></div>
            
            </v-card>
          </v-col>
          
        </v-row>
      </v-container>

      <!-- MAIN CONTENT -->
     
      <v-row justify="space-between" v-if="ready">
        <v-col cols="12" md="8" class="pt-0">
          
          <!-- POSTS AND POSTS ACTIONS -->
          <v-container>
            <v-row class="bgd">
              
              <!-- POST ACTIONS -->
              <v-col sm="12" md="12" pb-1 v-if="curRoom">
                <v-card class="" outlined>
                  <v-card-actions>
                  
                    <v-btn color="primary lighten-2" dark depressed text-color="white" 
                      @click="isSuperUser ? new_post_dialog = true : $router.push('/upgrade')">      
                      <v-icon class="pr-2">mdi-plus-circle</v-icon>
                      New Post
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- POSTS -->
              <v-col cols="12" pt-0>

                <welcome-post-template
                  v-if="posts.length == 0 || $route.query.new"
                />

                <post-template 
                  :posts="posts"
                  :loading_more_posts="loading_more_posts"
                  
                  @loadmore="''"
                />
                
              </v-col>

            </v-row>
          </v-container>
        </v-col>

        <!-- CAMPAIGNS ON LARGE SCREENS -->
        <v-col cols="12" md="4" order-sm2 v-if="breakpoint.mdAndUp">
          <campaigns-list :campaigns="campaigns" :sorted="sorted"/>
        </v-col>

      </v-row>
    </transition>

    <v-bottom-navigation
      v-model="bottomNav"
      color="indigo"
      shift app
      hide-on-scroll
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-btn>
        <span>Recents</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn>
        <span>Favorites</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn>
        <span>Nearby</span>
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable :close-on-content-click="false"
      persistent :fullscreen='breakpoint.smAndDown'
      max-width="650px"
      :transition="switchTransition">

      <new-post></new-post>
    </v-dialog>

  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Home | Votertye',
    posts: [],
    feed_model: 'Feed',
    expanded: [],
    offset: '',
    posts_offset: '',
    bottomNav: 3,
    readmore: [],
    loading: [],
    loading_comments: [],
    loading_more_comments: [],
    loading_more_posts: false,
    loading_more_campaigns: false,
    isLastDoc: false,
    isLastCampaign: false,
    new_campaign: false,
    disabled_btns: [],
    sorted: [],
    campaigns: [],
    campRef: '', // for listener
    view_campaign: false,
    selected_campaign: 0,
    waiting: false,
    userProfile:{},
    new_post_dialog: false,
    comments: {},
    body: [],
    campaignsLimit: 5,
    ready: false,
    nodata: false,
    
  }),
  watch: {
    'curRoom': function(){
      // this.latestPosts()
      // this.latestCampaigns()
    },
  },
  components: {
    Navigation,
    ViewProfile,
    NewPost,
    CampaignsList,
    ListEvents,
    PostTemplate,
    WelcomePostTemplate
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    switchTransition(){
      return this.breakpoint.smAndDown ? 
      'slide-x-reverse-transition' : 
      'dialog-transition'
    },
    styleForTabs(){
      if(this.breakpoint.xsOnly){
        return {height:'calc(100vh - 112px)'}
      }
      
    },
    moreImages(){
      return this.breakpoint.xsOnly ? {
        top:'34%'
      } : {
        top:'27%'
      }
    },
    moreImagesText(){
      return this.breakpoint.xsOnly ? {
        marginTop:'42%'
      } : {
        marginTop:'90%'
      }
    },
    myContests(){
      let enrolled = []
      this.getMyEnrolled.forEach(election=>{
        if(election.contestants.find(contestant => contestant == this.getUser.uid)){
          enrolled.push(election)
        }
      })
      return enrolled
    },
    getCampaigns(){
      let sorted = this.campaigns.sort((a,b)=>
       
        b.date_created - a.date_created
      )
      return sorted
    },
    
  },
  methods:{
    
    async postAuthor(author){
      return await this.$gun
        .get(author['#']).then()
    },
    async latestPosts(){

        console.log(this.getMyEnrolled)

        // for (const elec of this.getMyEnrolled) {
          
        // }

        // this.$gun.get('users').get(this.getUser.username)
        // .get('enrolled')
        // .map()

        // if(this.getMyEnrolled[0]){

          this.$gun
          .get('users')
          .get(this.getUser.username)
          .get('enrolled')
          .map()
          // .get(this.getMyEnrolled[0].electionId)
          .get('posts')
          // .map()
          .open(async (posts,key) => {
            
            // let posts = Object.values(data)
            // console.log(posts)
            Promise.all(Object.values(posts)
            .filter(p => p != null && p.author)
            .map(async p => {
              console.log({p})
              return {
                ...p,
                // author: await this.$gun.get('users').get(p.author).then(),
                imgs: p.imgs ? Object.values(p.imgs) : []
              }
            })).then(all => {
              console.log({all})
              this.posts = all
            })

            // this.posts = posts.map(post => {
  
              // if(post){
      
              //   let p = Object.assign({}, post)
  
              //   p.author = typeof post.author == 'object' ? post.author : await this.$gun.get('users')
              //   .get(post.author).then()
                
              //   // p.imgs = post.imgs ? post.imgs : []
              //   if(post.imgs){
              //     let imgs = []
              //     this.$gun.get(post.imgs['#'])
              //     .once(i => {
              //       console.log({i})
              //       delete i['_']
              //       imgs.push(Object.values(i))
              //     })
              //     p.imgs = imgs
              //   }
  
              //   // p.reactions = await this.$gun.get(pos)
    
    
              //   // p.liked = this.hasLiked(p)
              //   // console.log(p)
              //   // this.posts.find(p => p.docId == post.docId) ? '' : 
              //   // this.posts.push(p)
              //   // return p
              // }
            // }).filter(i => i != undefined)
          })

        // }
        
        this.ready = true;
        
  
      // }

    },
    async latestCampaigns(){
      
      let now = Date.now()
      let twenty4hrs = 24 * 60 * 60 * 1000
      let date_key = (new Date()).toISOString().substr(0,10)
      
      let myArr = []
      // get an election's campaigns
      this.$gun.get('users').get(this.getUser.username)
        .get('enrolled')
        .map()
        .get('campaigns')
        .get(date_key) // get only today campaigns
        .map()
        .on((d,k) => {
          // console.log({d,k})

          let c = Object.assign({}, d)
          if(d.author){

            this.$gun.get('users').get(d.author).once(a => {
              c.author = a
            })
            myArr.push(c)
          }
          
        }, {change: true})
        
      // console.log(myArr)

      this.campaigns = myArr

    
    },
    hasLiked(post){
      let liked = false
      let postRef = this.$gun.get('elections')
        .get(post.elecRef)
        .get('posts')
        .get(post.docId)

        postRef
        .get('reactions')
        .get(this.getUser.username)
        .once(d => {
          // rxns.push(d)
          // console.log({d})
          liked = d == true ? true : false
        })
      return liked
    },
    
  },
  mounted(){
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.new_post_dialog = false
    })
    this.$eventBus.$on('HideNewCampaignDialog', data=>{
      this.new_campaign = false
    })
    

    this.$eventBus.$on('HideCampaign',data=>{
      this.view_campaign = false
      this.selected_campaign = 0
      // console.log(this.view_campaign, this.selected_campaign)
    })

    this.latestPosts()
    this.latestCampaigns()

    if(this.$route.query.new){
      if(this.isSuperUser){
        this.new_post_dialog = true
      }
    }
    
  },
  destroyed(){
    // this.campRef()
  }
}
import Navigation from '@/components/Navigation'
import PostTemplate from '@/components/feed/PostTemplate'
import WelcomePostTemplate from '@/components/feed/WelcomePostTemplate'
import ViewProfile from '@/components/dialogs/ViewProfile'
import NewPost from '@/components/feed/NewPost'
import CampaignsList from '@/components/feed/CampaignsList'

import {uniq} from 'lodash'
import ListEvents from '@/components/events/ListEvents'
import {mapGetters, mapState} from 'vuex'
// import {firebase, db, database} from '@/plugins/firebase'

</script>
<style lang="scss" scoped>
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

  a{
    text-decoration: none;
  }
  .linkify{
    cursor: pointer;
  }
  
  .emojis{
    font-size: 22px;
  }
  .wireframe::after{
    content: '';
    position: absolute;
    width: 40%;
    height: 12px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255,255,255, 15%), rgba(0, 0, 0, 0));
    transform: translateX(-10%);
    animation: loading 1.5s infinite;
  }

  .round_top{
    @include borderTopRadius(10px);
  }
  #more_images{
    height: 200px;
    position: absolute;
    width: 100px;
    top: 27%;
    right: 15px;
    background-color: rgba(0, 0, 0, 0.7);
  }
  @keyframes loading{
    100%{
      transform: translateX(100%)
    }
  }
</style>
