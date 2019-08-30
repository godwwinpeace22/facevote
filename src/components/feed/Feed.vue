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
        <v-layout row wrap>
          <v-flex xs12>
            <list-events/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>

    <transition name="fade" mode="out-in">
      <!-- LOADING WIREFRAME -->
      <v-container grid-list-xl v-if="!ready" fluid>
        <v-layout row wrap justify-space-between>
          <v-flex xs12 sm12 md4 order-md2>
            <v-card :height="breakpoint.smAndDown ? 150 : 400" flat class="elevation-0" elevation-0>
              <v-list two-line dense>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    
                    <v-avatar color="grey lighten-3" size="40" tile>
                      
                    </v-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="px-0">
                    <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                    <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md7 >
            <v-card  v-for="(post,i) in 2" :key="i" flat
              height="250" class="mb-3 pb-2">
              
              <v-list two-line dense>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    
                    <v-avatar color="grey lighten-3" size="40">
                      
                    </v-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="px-0">
                    <div class="grey lighten-3 wireframe mb-2" style="width:40%;height:12px;"></div>
                    <div class="grey lighten-3 wireframe" style="width:30%;height:12px;"></div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <div class="grey lighten-3 wireframe mx-3 mb-3 mt-4" style="width:70%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:90%;height:12px;"></div>
              <div class="grey lighten-3 wireframe mx-3 mb-3" style="width:50%;height:12px;"></div>
            
            </v-card>
          </v-flex>
          
        </v-layout>
      </v-container>

      <!-- MAIN CONTENT -->
      <v-container grid-list-sm :class="{'px-1':breakpoint.smAndDown, 'white': feed_model == 'Campaigns'}" 
        v-if="ready">
        <v-layout row wrap justify-space-between>
          <v-flex xs12 md8 >
            <v-tabs-items v-model="feed_model" class="">
              <v-tab-item value="Feed" :style="styleForTabs">

                <!-- POSTS AND POSTS ACTIONS -->
                <v-container pa-0 >
                  <v-layout row wrap>
                    
                    <!-- POST ACTIONS -->
                    <v-flex sm12 md12 pb-1>
                      <v-card class="round_top pt-1" height="" color="" flat :dark="$store.state.theme == 'dark'">
                        <v-card-actions>
                       
                          <v-btn color="secondary lighten-2" dark depressed text-color="white" 
                            @click="isSuperUser ? new_post_dialog = true : $eventBus.$emit('Show_Upgrade_Dialog')">      
                            <v-icon class="pr-2">mdi-plus-circle</v-icon>
                            New Post
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>

                    <!-- POSTS -->
                    <v-flex xs12 sm12 md12 pt-0>

                      <welcome-post-template
                        v-if="posts.length == 0 || $route.query.new"
                      />

                      <post-template 
                        :posts="posts"
                        :loading_more_posts="loading_more_posts"
                        :is-last-doc="isLastDoc"
                        @loadmore="morePosts"
                      />
                      
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-tab-item>

              <v-tab-item value="Campaigns" v-if="breakpoint.smAndDown" :style="styleForTabs">
                <v-container grid-list-xs pa-0>
                  <v-layout column fill-height>
                    <v-flex xs12>
                      <v-card flat class="elevation-0" elevation-0 :dark="$store.state.theme == 'dark'">
                        <v-subheader class="font-weight-bold">Campaigns</v-subheader>
                        <v-list dense>
                          <v-list-tile avatar @click="newCampaign" v-if="isSuperUser">
                            <v-list-tile-avatar color="grey">
                              <v-avatar size="40" color="grey">
                                <v-icon small color="white">mdi-plus</v-icon>
                              </v-avatar>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title class="secondary--text">
                                Add Your Campaign</v-list-tile-title>
                              <!-- <v-list-tile-sub-title>Campaigns disappears after 24 hours</v-list-tile-sub-title> -->
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>

                        <v-list two-line dense  v-if="getCampaigns.length > 0">
                          <v-list-tile avatar v-for="(campaign,i) in sorted" :key="i" @click="selectCampaign(campaign)">
                            <v-list-tile-avatar :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                              <v-avatar size="45" :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                                <img :src="campaign.onr.photoURL" v-if="campaign.onr.photoURL" alt="alt">
                                <v-icon v-else small color="white">{{campaign.onr.name.charAt(0)}}</v-icon>
                              </v-avatar>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title class="secondary--text text-capitalize">
                                {{campaign.onr.name}}</v-list-tile-title>
                              <v-list-tile-sub-title>
                                {{$helpers.parseDate(campaign.latest)}}
                                <v-icon small color="primary" class="pr-1">mdi-chart-donut</v-icon>{{campaign.count}}
                              </v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>

                        <v-card-actions>
                          <v-btn flat small v-if="getCampaigns.length >= 15"
                            color="secondary" class="text-capitalize"
                            @click="moreCampaigns" :loading="loading_more_campaigns">See More</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>

              <v-tab-item value="Events" :style="styleForTabs">
                <v-container grid-list-xs px-2 py-1>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <list-events/>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>

            </v-tabs-items>
          </v-flex>

          <!-- ADS AND CAMPAIGNS ON LARGE SCREENS-->
          <v-flex xs12 md4 order-sm2 v-if="breakpoint.mdAndUp">
            
            <v-container grid-list-xs pa-0>
              <v-layout column>
                <v-flex xs12>
                  <v-card flat class="elevation-0 round_top" elevation-0>
                    <div style="overflow-y:auto;">
                      <v-subheader class="font-weight-bold">Campaigns</v-subheader>
                      
                      <v-list dense >
                        <v-list-tile avatar @click="newCampaign" v-if="isSuperUser">
                          <v-list-tile-avatar color="grey">
                            <v-avatar size="45" color="grey">
                              <v-icon small color="white">mdi-plus</v-icon>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="secondary--text">
                              Add Your Campaign</v-list-tile-title>
                            <!-- <v-list-tile-sub-title>Add a campaign that disappears in 24 hours</v-list-tile-sub-title> -->
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>

                      <v-list two-line dense  v-if="getCampaigns.length > 0">
                        <v-list-tile avatar v-for="(campaign,i) in sorted" :key="i" @click="selectCampaign(campaign)">
                          <v-list-tile-avatar :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                            <v-avatar size="45" :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                              <img :src="campaign.onr.photoURL" v-if="campaign.onr.photoURL" alt="alt">
                              <v-icon v-else small color="white">{{campaign.onr.name.charAt(0)}}</v-icon>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="secondary--text text-capitalize">
                              {{campaign.onr.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              {{$helpers.parseDate(campaign.latest)}}
                              <v-icon small color="primary" class="pr-1">mdi-chart-donut</v-icon>{{campaign.count}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </div>
                    <v-card-actions>
                      <v-btn flat small v-if="getCampaigns.length >= 15"
                        color="secondary" class="text-capitalize"
                        @click="moreCampaigns" :loading="loading_more_campaigns">See More</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-flex>

        </v-layout>
      </v-container>
    </transition>
    
    <!-- NEW CAMPAIGN DIALOG -->
    <v-dialog v-model="new_campaign" lazy scrollable persistent
      max-width="500px" :transition="switchTransition" :fullscreen="breakpoint.smAndDown">
      <v-card flat>
        <v-toolbar card dense flat>
          <span>Create a Campaign</span>
          <v-spacer></v-spacer>
          <v-btn flat icon @click="new_campaign = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          
          <new-campaign v-if="isSuperUser"/>
          <div v-else class="pa-2">
            upgrade your account
          </div>
        </v-card-text>
        
      </v-card>
      
    </v-dialog>

    <!-- VIEW CAMPAIGN -->
    <v-dialog v-model="view_campaign" content-class="white view_dialog" 
      v-if="view_campaign" max-width="500" lazy :transition="switchTransition"
      :fullscreen="breakpoint.smAndDown" scrollable hide-overlay>

      <view-campaign :selectedcampaign="selected_campaign" :campaigns='getCampaigns'/>
        
      
    </v-dialog>

    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable lazy
      persistent :fullscreen='breakpoint.smAndDown'
      max-width="650px"
      :transition="switchTransition">

      <new-post :user='getUserInfo'></new-post>
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
    'campaigns': function(){
      this.sortCampaigns()
    }
  },
  components: {
    Navigation,
    ViewProfile,
    NewPost,
    NewCampaign,
    ViewCampaign,
    ListEvents,
    PostTemplate,
    WelcomePostTemplate
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curRoomId'
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
    getCampaigns(){
      let sorted = this.campaigns.sort((a,b)=>
       
        b.tstamp.toMillis() - a.tstamp.toMillis()
      )
      return sorted
    },
    filter_items(){
      return [
        {val: 'group', text: 'Current Election'},
        {val:'dept',text:'My department only'},
        {val:'fac',text:'My faculty only'},
        {val:'sch',text:'Show all posts'}
      ]
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
    
  },
  methods:{
    newCampaign(){
      this.isSuperUser ?
      this.new_campaign = true : 
      this.$eventBus.$emit('Open_Upgrade_Dialog')
    },
    sortByUid(){
			return this.campaigns.sort((a,b) => b.onr.uid - a.onr.uid)
		},
    sortCampaigns(){
      // group campaigns by user
      const uniqueArray = this.getCampaigns.filter((thing,index) => {
        return index === this.getCampaigns.findIndex(obj => {
          return JSON.stringify(obj) === JSON.stringify(thing);
        })
      })

      let uniques = []
      
      uniqueArray.forEach((item,i) =>{
        if(!uniques.find(camp => camp.onr.uid == item.onr.uid)){
          let user_campaigns = uniqueArray.filter(u => u.onr.uid == item.onr.uid)
          uniques.push({
            ...item,
            latest: user_campaigns[0].tstamp, // the latest by the user
            count: user_campaigns.length // number of 
            // campaigns by this user
          })
        }
      })
      this.sorted = uniques
      return uniques
    },
    selectCampaign(campaign){
      
      let index = this.getCampaigns.findIndex(camp => {
        return camp.onr.uid == campaign.onr.uid
      })
      // console.log({campaign, index})
      this.selected_campaign = index
      this.view_campaign = true;
    },
    morePosts(){
      // Load more, older posts
      this.loading_more_posts = true

      let lastPost = this.posts[this.posts.length -1 ]
      let postsCollection = db.collection('posts')

      postsCollection.doc(lastPost.docId).get().then(documentSnapshot => {

        postsCollection.where('elecRef','==', this.curRoom.electionId)
        .orderBy('tstamp','desc').startAfter(documentSnapshot)
        .limit(10).get().then(querySnapshot =>{
          let posts = []
          querySnapshot.forEach(doc => {
            this.posts.push(doc.data())
          });

          this.isLastDoc = querySnapshot.empty
          this.loading_more_posts = false
        })
      })

    },
    moreCampaigns(){
      // Load more, older posts
      this.loading_more_campaigns = true

      let lastCampaign = this.campaigns[this.campaigns.length -1 ]
      let campaignCollection = db.collection('campaign_posts')

      campaignCollection.doc(lastCampaign.docId).get().then(documentSnapshot => {
        
        let now = Date.now()
        this.campRef = campaignCollection
          .where('elecRef','==', this.curRoomId)
          .where('expires_in', '>', now)
          .orderBy("expires_in")
          .startAfter(documentSnapshot)
          .limit(15).get().then(querySnapshot =>{
          
          querySnapshot.forEach(doc => {
            this.campaigns.push(doc.data())
          });

          
          this.isLastCampaign = querySnapshot.empty
          this.loading_more_campaigns = false
        })

      }).catch(err => this.loading_more_campaigns = false)

    },
    latestPosts(){
      return new Promise((resolve,reject)=>{
        if(this.curRoomId){

          let docRef = db.collection('posts')
          .where('elecRef','==',this.curRoomId)
          .orderBy('tstamp','desc')
          .limit(15)
          docRef.onSnapshot(querySnapshot=>{
            let posts = []
            querySnapshot.forEach(doc => {
              //console.log(doc.data().id)
              posts.push(doc.data())
            });
  
            this.posts_offset = querySnapshot.docs[querySnapshot.docs.length-1]
            // this.posts = posts.sort((a,b)=> b.tstamp - a.tstamp)
            this.posts = posts
  
            this.ready = true;
            this.nodata = false
            resolve(this.posts)
          }, err=> {
            // console.log(err)
          })
        }
        else {
          this.ready = true;
          this.nodata = true
        }
       
      })
    },
    latestCampaigns(){
      return new Promise((resolve,reject)=>{
        if(this.curRoomId){

          let now = Date.now()
          let twenty4hrs = 24 * 60 * 60 * 1000
          this.campRef = db.collection('campaign_posts')
          .where('elecRef','==', this.curRoomId)
          .where('expires_in', '>', now)
          .orderBy("expires_in")
          .limit(15)
          .onSnapshot(docs=>{
            let myArr = []

            docs.docChanges().forEach(function(change) {
              if (change.type === "added") {
                  // console.log("New", change.doc.data());
                  myArr.push(change.doc.data())
              }
            })
            
            // console.log(myArr)
            this.campaigns = myArr.filter(campaign => {
              if(campaign.tstamp){

                let pass = now - campaign.tstamp.toMillis() < twenty4hrs
                // console.log({pass, campaign})
                return pass
              }
            })

            // this.sortCampaigns()
            this.ready = true;
            this.nodata = false
          },(err)=> reject(err))
       
          resolve(this.campaigns)
        }
      })
    },
    
  },
  mounted(){
    this.$eventBus.$on('HideNewPostDialog', data=>{
      this.new_post_dialog = false
    })
    this.$eventBus.$on('HideNewCampaignDialog', data=>{
      this.new_campaign = false
    })
    this.$eventBus.$on('PushNewCampaign',data=>{
      // this.posts.unshift(data)
      this.latestCampaigns().then(()=> {
        this.sortCampaigns()
      })
    })
    this.$eventBus.$on('HideCampaign',data=>{
      this.view_campaign = false
      this.selected_campaign = 0
      // console.log(this.view_campaign, this.selected_campaign)
    })

    
  },
  async created(){
    firebase.auth().onAuthStateChanged(async (user)=>{
      if (user) {
        await this.latestPosts()
        await this.latestCampaigns()
        // this.getUserInfo.is_student ? this.allElections(this.getUserInfo) : ''
      
      } else {
        // console.log('No user is signed in.')
      }
    });

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
import NewCampaign from '@/components/profile/NewCampaign'
import ViewCampaign from '@/components/dialogs/ViewCampaign'

import ListEvents from '@/components/events/ListEvents'
import {mapGetters, mapState} from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'

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
