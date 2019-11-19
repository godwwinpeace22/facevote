<template>
  <div style="background: ;">
    <vue-headful :title="title"/>

    <navigation>
      <span slot="title">Feed</span>
      <v-toolbar slot="extended_nav" color="teal" dark flat
        style='background-color:#29648a;' dense v-if="breakpoint.smAndDown">
        <v-tabs v-model="feed_model" color="teal" 
          v-if="breakpoint.smAndDown" slider-color="yellow">
          <v-tab
            v-for="item in ['Feed','Campaigns', 'Events']"
            :key="item"
            :href="`#${item}`"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
    </navigation>

    <!-- Events -->
    <v-navigation-drawer width='250' right hide-overlay clipped app style="background:#eceff1;">
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
      <v-container grid-list-xl v-if="!ready" fluid>
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
      <v-container :class="['py-0', {'white': feed_model == 'Campaigns'}]" 
        v-if="ready">
        <v-row justify="space-between">
          <v-col cols="12" md="8" class="pt-0">
            <v-tabs-items v-model="feed_model" class="">
              <v-tab-item value="Feed" :style="styleForTabs">

                <!-- POSTS AND POSTS ACTIONS -->
                <v-container pa-0 class="grey lighten-4">
                  <v-row row wrap>
                    
                    <!-- POST ACTIONS -->
                    <v-col sm="12" md="12" pb-1>
                      <v-card class="round_top" height="" color="" flat>
                        <v-card-actions>
                       
                          <v-btn color="primary lighten-2" dark depressed text-color="white" 
                            @click="isSuperUser ? new_post_dialog = true : $eventBus.$emit('Show_Upgrade_Dialog')">      
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
                        :is-last-doc="isLastDoc"
                        @loadmore="''"
                      />
                      
                    </v-col>

                  </v-row>
                </v-container>
              </v-tab-item>

              <v-tab-item value="Campaigns" v-if="breakpoint.smAndDown" :style="styleForTabs">
                <!-- <v-container grid-list-xs pa-0>
                  <v-row column fill-height>
                    <v-col cols="12">
                      <v-card flat class="elevation-0" elevation-0 :dark="$store.state.theme == 'dark'">
                        <v-subheader class="font-weight-bold">Campaigns</v-subheader>
                        <v-list dense>
                          <v-list-item  @click="newCampaign" v-if="isSuperUser">
                            <v-list-item-avatar color="grey">
                              <v-avatar size="40" color="grey">
                                <v-icon small color="white">mdi-plus</v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title class="primary--text">
                                Add Your Campaign</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>

                        <v-list two-line dense  v-if="getCampaigns.length > 0">
                          <v-list-item  v-for="(campaign,i) in sorted" :key="i" @click="selectCampaign(campaign)">
                            <v-list-item-avatar :color="$helpers.colorMinder(campaign.author.name.charAt(0))">
                              <v-avatar size="45" :color="$helpers.colorMinder(campaign.author.name.charAt(0))">
                                <img :src="campaign.author.photoURL" v-if="campaign.author.photoURL" alt="alt">
                                <v-icon v-else small color="white">{{campaign.author.name.charAt(0)}}</v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title class="primary--text text-capitalize">
                                {{campaign.author.name}}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{$helpers.parseDate(campaign.latest)}}
                                <v-icon small color="primary" class="pr-1">mdi-chart-donut</v-icon>{{campaign.count}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>

                        <v-card-actions>
                          <v-btn text small v-if="getCampaigns.length >= 15"
                            color="primary" class="text-capitalize"
                            @click="moreCampaigns" :loading="loading_more_campaigns">See More</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container> -->
                <campaigns :campaigns="campaigns" :sorted="sorted"/>

              </v-tab-item>

              <v-tab-item value="Events" :style="styleForTabs">
                <v-container grid-list-xs px-2 py-1>
                  <v-row row wrap>
                    <v-col cols="12">
                      <!-- <list-events/> -->
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>

            </v-tabs-items>
          </v-col>

          <!-- ADS AND CAMPAIGNS ON LARGE SCREENS-->
          <v-col cols="12" md="4" order-sm2 v-if="breakpoint.mdAndUp">
            <campaigns :campaigns="campaigns" :sorted="sorted"/>
          </v-col>

        </v-row>
      </v-container>
    </transition>

    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable  
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
      this.latestPosts()
      this.latestCampaigns()
    },
  },
  components: {
    Navigation,
    ViewProfile,
    NewPost,
    Campaigns,
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

      // if(this.curRoom && this.curRoom.electionId){

        this.$gun.get(this.getUser.username)
        .get('enrolled')
        .map()
        .get('posts')
        .map().on(async (post,key) => {

          let author = post.author['#']
          // console.log({post, author})

          let p = Object.assign({}, post)
          p.author = await this.$gun
            .get(author).then()
          if(p.imgs){
            let imgs = []
            this.$gun.get(p.imgs['#']).map().once(img => {
              imgs.push(img)
            })
            // console.log({imgs})
            p.imgs = imgs
          }
          else {
            p.imgs = []
          }
          this.posts.find(p => p.docId == post.docId) ? '' : this.posts.push(p)
        })
  
        this.ready = true;
        this.nodata = false
      // }

    },
    async latestCampaigns(){
      
      if(this.curRoom && this.curRoom.electionId){

        let now = Date.now()
        let twenty4hrs = 24 * 60 * 60 * 1000
        let date_key = (new Date()).toISOString().substr(0,10)
        
        let myArr = []
        // get an election's campaigns
        this.$gun.get('campaigns')
          .get(this.curRoom.electionId)
          .get(date_key) // get only today campaigns
          .map()
          .on((d,k) => {
            console.log({d,k})
            this.$gun.get(d.author).once(a => {
              d.author = a
            })
            myArr.push(d)
            
          }, {change: true})
          
        // console.log(myArr)

        this.campaigns = myArr
        // .filter(campaign => 
          
        //   now - campaign.date_created < twenty4hrs
            
        // )
      }

    
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
    
  },
  destroyed(){
    // this.campRef()
  }
}
import Navigation from '@/components/Navigation'
import PostTemplate from '@/components/feed/PostTemplate'
import WelcomePostTemplate from '@/components/feed/WelcomePostTemplate'
import ViewProfile from '@/components/dialogs/ViewProfile'
import NewPost from '@/components/profile/NewPost'
import Campaigns from '@/components/feed/Campaigns'

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
