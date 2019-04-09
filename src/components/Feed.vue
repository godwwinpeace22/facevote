<template>
  <div style="background: ;">
    <vue-headful :title="title"/>

    <navigation>
      <v-toolbar slot="extended_nav" color="teal" dark flat
        style='background-color:#29648a;' dense v-if="$vuetify.breakpoint.smAndDown">
        <v-tabs v-model="feed_model" color="teal" 
          v-if="$vuetify.breakpoint.smAndDown" slider-color="yellow">
          <v-tab
            v-for="item in ['Feed','Campaigns']"
            :key="item"
            :href="`#${item}`"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
    </navigation>

    <!-- POPULAR ELECTIONS -->
    <v-navigation-drawer width='250' right hide-overlay clipped app style="background:#eceff1;">
      <v-subheader class="font-weight-bold">Sponsored</v-subheader>
      <v-container grid-list-xs px-2 py-1>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card height="200" dark flat>
              
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>

    <!--loading-bar spinnerType='circle' v-if="!ready">
      <div slot="loading_info">Loading posts...</div>
    </loading-bar-->

    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" top>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <!-- LOADING WIREFRAME -->
    <v-container grid-list-xl v-if="!ready" fluid>
      <v-layout row wrap justify-space-between>
        <v-flex xs12 sm12 md4 order-md2>
          <v-card :height="$vuetify.breakpoint.smAndDown ? 150 : 400" flat class="elevation-0" elevation-0>
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
    
    <!-- NO DATA -->
    <v-container grid-list-xl v-if="nodata" mt-5>
      <v-layout row wrap>
        <v-flex xs6>
          <v-card class="round secondary lighten-3" height="400">
            
          </v-card> 
        </v-flex>
        <v-flex xs6>
          <v-card class="round purple lighten-2" height="400">
            
          </v-card> 
        </v-flex>
      </v-layout>
    </v-container>

    <!-- MAIN CONTENT -->
    <v-container grid-list-sm  :class="{'px-1':$vuetify.breakpoint.smAndDown, 'white': feed_model == 'Campaigns'}" 
      v-if="ready && !nodata">
      <v-layout row wrap justify-space-between>
        <v-flex xs12 md8 >
          <v-tabs-items v-model="feed_model" class="">
            <v-tab-item value="Feed" :style="styleForTabs">

              <!-- ADS ON SMALL SCREENS-->
              <v-container grid-list-xs pa-0 v-if="$vuetify.breakpoint.smAndDown">
                <span class="pl-3 grey--text lighten-3">Sponsored</span>
                <v-layout row wrap>
                  <v-flex xs12 sm3>
                    <v-card dark height="150">
                      
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- POSTS AND POSTS ACTIONS -->
              <v-container pa-0 >
                <v-layout row wrap>
                  
                  <!-- POST ACTIONS -->
                  <v-flex sm12 md12 pb-1>
                    <v-card class="round_top pt-1" height="50" color="" flat :dark="$store.state.theme == 'dark'">
                      <v-btn color="teal" dark depressed v-if="isSuperUser" text-color="white" class="linkify" 
                        @click="new_post_dialog = true">      
                        <v-icon class="pr-2">add_circle</v-icon>
                        New Post
                      </v-btn>
                      <v-tooltip right v-else>
                        <v-btn color="teal" slot="activator" disabled text-color="white" class="linkify">
                          <v-icon class="pr-2">add_circle</v-icon>
                          New Post
                        </v-btn>
                        <span>This feature requires a premium account</span>
                      </v-tooltip>

                      <!-- <v-chip color="teal" text-color="white" class="linkify" @click="$store.dispatch('switchTheme','true')">
                        <v-avatar>
                          <v-btn icon dark><v-icon>brightness_5</v-icon></v-btn>
                        </v-avatar>
                        <span class="pr-1 text-capitalize">{{$store.state.theme }} </span> theme
                      </v-chip> -->

                      <!-- <v-menu offset-y content-class="round">
                        <v-chip color="secondary" slot="activator" class="linkify" text-color="white">
                          <v-avatar>
                            <v-icon>filter_list</v-icon>
                          </v-avatar>
                          Filter Posts
                        </v-chip>
                        <v-list dense dark class="">
                          <v-list-tile class="orange--text">
                            <v-list-tile-title>Show posts from:</v-list-tile-title>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile v-for="item in filter_items"
                            :key="item.key" @click="filterPostsBy(item.val)">
                            <v-list-tile-title>{{ item.text }}
                              <v-icon v-if="getFeedFilter && item.val == getFeedFilter.key" small color="success">check</v-icon>
                            </v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu> -->
                      
                    </v-card>
                  </v-flex>

                  <!-- POSTS -->
                  <v-flex xs12 sm12 md12 pt-0>
                    <v-subheader v-if="posts.length == 0">No posts for the current election or applied filter</v-subheader>
                    <v-card  v-for="(post,i) in posts" :key="i + '_posts'" :dark="$store.state.theme == 'dark'"
                      height="" elevation-1 class="mb-3 pb-2 " :flat="$vuetify.breakpoint.xsOnly">
                      
                      <v-list two-line dense>
                        <v-list-tile avatar>
                          <v-list-tile-avatar>
                            <img :src="post.onr.photoURL" v-if="post.onr.photoURL">
                            <v-avatar v-else :color="$helpers.colorMinder(post.onr.name.charAt(0))" size="40">
                              <span class="white--text headline">{{post.onr.name.charAt(0)}}</span>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="secondary--text text-capitalize font-weight-bold linkify" style="width:fit-content" 
                              @click="$eventBus.$emit('ViewProfile', post.onr)">
                              {{post.onr.name}}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>{{$helpers.parseDate(post.tstamp, true)}}</v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-progress-circular v-if="waiting" :value="10"  class="d-inline-block" color="grey" indeterminate></v-progress-circular>
                            <v-menu offset-y top left>
                            <v-icon color="grey" slot="activator">more_horiz</v-icon>
                              
                            </v-menu>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>

                      <v-card-text>
                        <span v-if="readmore.find(id=>id == post.docId)">{{post.body}}</span>
                        <span v-else>{{$helpers.truncateText(post.body, 200)}}</span>
                        <span @click="readmore.push(post.docId)" class="secondary--text linkify" 
                          style="text-decoration:none;" v-show="post.body.length > 200 && !readmore.find(id=>id == post.docId)">
                          Read more
                        </span>

                        <!-- POST IMAGES -->
                        <v-container grid-list-sm class="px-0" v-if="post.imgs.length > 0">
                          <v-layout row wrap>
                            <v-flex v-for="(image,i) in post.imgs.slice(0,4)" :key="i" class="" 
                              :class="{'xs3': post.imgs.length >=3,'xs12': post.imgs.length == 1,'xs6': post.imgs.length == 2}">
                              <v-card flat dark max-height="500px" :height="post.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" class="mb-3">
                                <v-img :src="image" :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" 
                                  alt="" class="grey lighten-2 linkify" height="100%" width="100%"
                                  @click="carouselDialog(post.imgs,i)">
                                  
                                  <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                  </v-layout>
                                </v-img>
                              </v-card>
                            </v-flex>
                            <v-flex xs3>
                              <v-card id="more_images" v-if="post.imgs.length > 4" :style="moreImages"
                                :height="post.imgs.length == 1 ? '100%' : $vuetify.breakpoint.xsOnly ? 100 : '200'" 
                                class="mb-3 linkify" dark @click="carouselDialog(post.imgs, post.imgs.length - 2)">
                                <div class="title text-xs-center" :style="moreImagesText">+ {{post.imgs.length - 4}} more</div>
                              </v-card>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>

                      <v-divider class="mx-3"></v-divider>
                      <v-card-actions>
                        <div style="width:fit-content;" class="text-xs-center">
                          
                          <v-btn depressed icon class="ml-1" small :disabled="!!disabled_btns.find(id => id == post.docId)" @click.native="add_reaction(post)">
                            <v-icon color="secondary" small>thumb_up</v-icon>
                          </v-btn>
                          <span class="">{{post.reactions}} Likes</span>

                          <v-btn icon dark class="ml-3" depressed small
                            @click.native="expand(i)">
                            <v-icon color="secondary" small>insert_comment</v-icon>
                          </v-btn>
                          <span class="linkify" @click="expand(post, i);">{{post.comments}} Comments</span>

                        </div>
                      </v-card-actions>

                      <!-- COMMENTS -->
                      <v-expand-transition>
                        <div v-if="expanded.indexOf(i) != -1">
                          <v-container class="px-1">
                            <v-card flat>
                              <v-card-text class="px-2">
                                <v-textarea auto-grow color="secondary" rows="1" v-model="body[post.docId]"
                                  name="comment" outline
                                  label="Add a comment" :ref="post.docId"
                                >
                                <v-btn icon slot="append-outer" :disabled="!!loading.find(id => id == post.docId)"
                                  @click.native="submitComment(post)" v-if="body[post.docId] && body[post.docId].trim()">
                                  <v-icon color="secondary" >send</v-icon>
                                </v-btn>
                                <!-- EMOJIS DIALOG-->
                                <v-menu max-width="380" :close-on-content-click='false'
                                  slot="prepend-inner" max-height="" top offset-y>

                                  <v-btn slot="activator" icon >
                                    <v-icon color="success">mood</v-icon>
                                  </v-btn>
                                  <v-card class="">
                                    <picker set="google" @select="appendEmoji($event,post)" :native="true" 
                                      title="Choose Emoji" emoji="grinning"/>
                                  </v-card>
                                </v-menu>
                                </v-textarea>
                              </v-card-text>
                              <v-card-actions>
                                
                              </v-card-actions>

                              <v-divider></v-divider>

                              <v-card-title class="font-weight-bold px-2">Comments</v-card-title>
                              <v-progress-circular indeterminate color="grey lighten-1" 
                                size="20" class="d-block mx-auto" v-if="loading_comments.find(id => id == post.docId)">
                              </v-progress-circular>

                              <v-subheader v-if="!loading_comments.find(id => id == post.docId) && comments[post.docId] && comments[post.docId].length == 0">No comments</v-subheader>

                              <v-card-text class="px-0" v-else>
                                <v-container grid-list-md py-0>
                                  <v-layout row wrap>
                                    <v-flex xs12 v-for="(comment,i) in comments[post.docId]" :key="'comment' + i">
                                      <v-card flat class="grey lighten-3 round">
                                        <v-list dense two-line class="grey lighten-3">
                                          <v-list-tile avatar @click="$eventBus.$emit('ViewProfile', comment.onr)">
                                            <v-list-tile-avatar :color="$helpers.colorMinder(comment.onr.name.charAt(0))" class="white--text">
                                              <img :src="comment.onr.photoURL" v-if="comment.onr.photoURL" alt="alt">
                                              <span v-else>{{comment.onr.name.charAt(0)}}</span>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content>
                                              <v-list-tile-title style="" class="secondary--text">
                                                {{comment.onr.name}}
                                              </v-list-tile-title>
                                              <v-list-tile-sub-title>{{$helpers.parseDate(comment.tstamp,true)}}</v-list-tile-sub-title>
                                            </v-list-tile-content>
                                          </v-list-tile>
                                        </v-list>

                                        <v-card-text>
                                          {{comment.body}}
                                        </v-card-text>
                                      </v-card>
                                    </v-flex>
                                  </v-layout>
                                </v-container>
                                
                              </v-card-text>

                              <template v-if="comments[post.docId] && comments[post.docId].length >= 4 && comments[post.docId].length < post.comments">
                                <v-btn 
                                  color="secondary" class="d-block mx-auto" 
                                  style="text-transform: initial" 
                                  :loading="!!loading_more_comments.find(id => id == post.docId)" 
                                  flat small @click="moreComments(post)">
                                  See more comments
                                </v-btn>
                              </template>
                            </v-card>
                          </v-container>
                          
                        </div>
                      </v-expand-transition>
                      
                    </v-card>
                    <v-btn color="secondary" style="text-transform: initial;" :loading="loading_more_posts"
                      @click="morePosts" class="d-block mx-auto" flat small >
                      See More
                    </v-btn>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-tab-item>

            <v-tab-item value="Campaigns" v-if="$vuetify.breakpoint.smAndDown" :style="styleForTabs">
              <v-container grid-list-xs pa-0>
                <v-layout column fill-height>
                  <v-flex xs12>
                    <v-card flat class="elevation-0" elevation-0 :dark="$store.state.theme == 'dark'">
                      <v-subheader class="font-weight-bold">Featured Campaigns</v-subheader>
                      <v-list three-line dense>
                        <v-list-tile avatar @click="new_campaign = true">
                          <v-list-tile-avatar color="grey">
                            <v-avatar size="45" color="grey">
                              <v-icon small color="white">add</v-icon>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="secondary--text">
                              Add Your Campaign</v-list-tile-title>
                            <v-list-tile-sub-title>Add a campaign that disappears in 24 hours</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                      <v-list two-line dense  v-if="getCampaigns.length > 0">
                        <v-list-tile avatar v-for="campaign in getCampaigns" :key="campaign.docId" @click="selected_campaign = campaign; view_campaign = true;">
                          <v-list-tile-avatar :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                            <v-avatar size="45" :color="$helpers.colorMinder(campaign.onr.name.charAt(0))">
                              <img :src="campaign.onr.photoURL" v-if="campaign.onr.photoURL" alt="alt">
                              <v-icon v-else small color="white">{{campaign.onr.name.charAt(0)}}</v-icon>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="secondary--text">
                              {{campaign.onr.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{campaign.onr.dept}}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-subheader v-if="campaignsLimit && getCampaigns.length > campaignsLimit">
                          <v-btn small flat @click="campaignsLimit = null" class="text-capitalize" color="secondary">see more</v-btn>
                        </v-subheader>
                      </v-list>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>

        <!-- ADS AND CAMPAIGNS ON LARGE SCREENS-->
        <v-flex xs12 md4 order-sm2 v-if="$vuetify.breakpoint.mdAndUp">
          
          <v-container grid-list-xs pa-0>
            <v-layout column>
              <v-flex xs12>
                <v-card flat class="elevation-0 round_top" elevation-0 :dark="$store.state.theme == 'dark'">
                  <div style="overflow-y:auto;">
                    <v-subheader class="font-weight-bold">Campaigns</v-subheader>
                    
                    <v-list three-line dense >
                      <v-list-tile avatar @click="newCampaign" v-if="isSuperUser">
                        <v-list-tile-avatar color="grey">
                          <v-avatar size="45" color="grey">
                            <v-icon small color="white">add</v-icon>
                          </v-avatar>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title class="secondary--text">
                            Add Your Campaign</v-list-tile-title>
                          <v-list-tile-sub-title>Add a campaign that disappears in 24 hours</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <!-- <v-tooltip top v-else>
                        <v-list-tile avatar @click="newCampaign" slot="activator" disabled class="grey lighten-3">
                          <v-list-tile-avatar color="grey">
                            <v-avatar size="45" color="grey">
                              <v-icon small color="white">add</v-icon>
                            </v-avatar>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="grey--text">
                              Add Your Campaign</v-list-tile-title>
                            <v-list-tile-sub-title>Add a campaign that disappears in 24 hours</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <span>This feature requires a premium account</span>
                      </v-tooltip> -->
                    </v-list>

                    <v-list two-line dense  v-if="getCampaigns.length > 0">
                      <v-list-tile avatar v-for="(campaign,i) in sortCampaigns" :key="i" @click="selectCampaign(i)">
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
                            {{new Date(campaign.tstamp).toLocaleString('en-Us', {weekday:'short',hour:'numeric'})}}
                            <v-icon small color="primary" class="pr-1">data_usage</v-icon>{{campaign.count}}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-subheader v-if="campaignsLimit && getCampaigns.length > campaignsLimit">
                        <v-btn small flat @click="campaignsLimit = null" class="text-capitalize" color="secondary">see more</v-btn>
                      </v-subheader>
                    </v-list>
                  </div>
                </v-card>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- NEW CAMPAIGN DIALOG -->
    <v-dialog v-model="new_campaign" lazy scrollable
      max-width="500px" transition="slide-x-transition">
      <v-card flat>
        <v-toolbar card dense flat>
          <span>Create a Campaign</span>
          <v-spacer></v-spacer>
          <v-btn flat icon @click="new_campaign = false">
            <v-icon>close</v-icon>
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
      v-if="view_campaign" max-width="500" lazy transition="slide-x-reverse-transition"
      :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>

      <view-campaign :selectedcampaign="selected_campaign" :campaigns='getCampaigns'/>
        
      
    </v-dialog>

    <!-- New Post Dialog -->
    <v-dialog
      v-model="new_post_dialog"
      scrollable lazy
      persistent :fullscreen='$vuetify.breakpoint.smAndDown'
      max-width="650px"
      transition="slide-x-reverse-transition">

      <new-post :user='getUserInfo'></new-post>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Home | Facevote',
    posts: [],
    snackbar: false,
    feed_model: 'Feed',
    elections: [],
    expanded: [],
    offset: '',
    posts_offset: '',
    readmore: [],
    loading: [],
    loading_comments: [],
    loading_more_comments: [],
    loading_more_posts: false,
    new_campaign: false,
    disabled_btns: [],
    campaigns: [],
    view_campaign: false,
    selected_campaign: 0,
    waiting: false,
    userProfile:{},
    new_post_dialog: false,
    comments: {},
    body: [],
    campaignsLimit: 5,
    ready: false,
    nodata: false
  }),
  watch: {
    getMyEnrolled: function(){
      this.getPosts()
    },
    curRoom: function(){
      this.getPosts()
    }
  },
  components:{
    Navigation,
    ViewProfile,
    NewPost,
    NewCampaign,
    ViewCampaign,
    Picker
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getFeedFilter',
      'getMyEnrolled'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curRoomId'
    ]),
    styleForTabs(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {height:'calc(100vh - 112px)'}
      }
      
    },
    moreImages(){
      return this.$vuetify.breakpoint.xsOnly ? {
        top:'34%'
      } : {
        top:'27%'
      }
    },
    moreImagesText(){
      return this.$vuetify.breakpoint.xsOnly ? {
        marginTop:'42%'
      } : {
        marginTop:'90%'
      }
    },
    getCampaigns(){
      let sorted = this.campaigns.sort((a,b)=>
        a.onr.name.toLowerCase() - b.onr.name.toLowerCase()
      )
      console.log(sorted)
      return this.campaignsLimit ? 
      sorted.slice(0,this.campaignsLimit) :
      sorted
    },
    sortCampaigns(){
      // group campaigns by user
      let uniques = []
      this.getCampaigns.forEach((item,i) =>{
        if(!uniques.find(camp => camp.onr.uid == item.onr.uid)){
          uniques.push({
            ...item,
            count: this.getCampaigns.filter(u => u.onr.uid == item.onr.uid).length // number of 
            // campaigns by this user
          })
        }
      })
      return uniques
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
    }
  },
  methods:{
    expand(post, doc_id){
      if(this.expanded.indexOf(doc_id) == -1){
        //this.expanded = []
        this.expanded.push(doc_id)
        this.getComments(post)
      }
      else{
        this.expanded.splice(this.expanded.indexOf(doc_id),1)
      }
      
    },
    
    newCampaign(){
      this.isSuperUser ?
      this.new_campaign = true : 
      this.$eventBus.$emit('Open_Upgrade_Dialog')
    },
    appendEmoji(emoji,post){
      console.log(emoji,post)
      console.log(this.body)
      this.body[post.docId] += emoji.native
    },
    async filterPostsBy(filter){
      
      let args = {
        key: filter,
        value: filter == 'dept' ? this.getUserInfo.department : 
        filter == 'fac' ? this.getUserInfo.faculty : 
        filter == 'sch' ? this.getUserInfo.school : this.curRoom.electionId,
        u:this.getUser.uid
      }
      // save the filter chosen in local storage
      this.$store.dispatch('saveFeedFilter', args)
      
      // filter the posts from the feed
      
      this.ready = false
      await this.latestPosts(args.key, args.value)
      await this.latestCampaigns(args.key, args.value)
    },
    selectCampaign(i){
      this.selected_campaign = i == 0 ? i : this.sortCampaigns[i-1].count;
      this.view_campaign = true;
    },
    async submitComment(post){
      let docId = post.docId
      this.loading.push(docId)
      let postRef = db.collection('posts').doc(docId)
      let commentRef = db.collection('comments').doc()
      
      // let currPost = this.posts.find(post=>post.id == docId)
      // currPost ? currPost.comments.push({
      //   by:this.getUser.uid,
      //   message:this.comment,
      //   dateCreated:Date.now(),
      // }) : ''
      
      commentRef.set({
        onr: ['name', 'photoURL','email','sch','fac','dept','uid']
          .reduce((a, e) => (a[e] = this.getUserInfo[e], a), {}),
        postRef: docId,
        body: this.body[docId],
        tstamp: Date.now()
      }).then(()=>{
        postRef.update({
          comments: post.comments ? post.comments * 1 + 1 : 1
        }).then(()=>{
          this.body[docId] = ''
          this.loading.splice(this.loading.indexOf(docId),1)
        })
      })
      
    },
    moreComments(post){
      this.loading_more_comments.push(post.docId)

      db.collection('comments').where('postRef', '==', post.docId)
      .orderBy('tstamp', 'desc').startAfter(this.offset)
      .limit(25).get().then(querySnapshot =>{
        let comments = []
        querySnapshot.forEach(doc => {
          comments.push(doc.data())
        });
        // console.log(querySnapshot.docs, this.offset)
        this.offset = querySnapshot.docs[querySnapshot.docs.length-1]

        this.comments[post.docId] ?
        this.comments[post.docId] = [...this.comments[post.docId], ...comments] :
        this.comments[post.docId] = comments

        console.log(comments)
        this.loading_more_comments.splice(this.loading_more_comments.indexOf(post.docId),1)
      }).catch(err => console.log(err))
    },
    async getComments(post){
      
      if(!this.comments[post.docId]){
        this.loading_comments.push(post.docId)
        // get comments for this post

        return db.collection('comments')
          .where('postRef', '==', post.docId)
          .orderBy('tstamp', 'desc').limit(4)
          .onSnapshot(querySnapshot =>{
            let comments = []
            querySnapshot.forEach(doc =>{
              comments.push(doc.data())
            })
            this.offset = querySnapshot.docs[querySnapshot.docs.length-1]

            this.comments[post.docId] = comments
            this.loading_comments.splice(this.loading_comments.indexOf(post.docId),1)
            return comments

          }, err => console.log(err))
      }
      
    },
    async getPosts(){
      this.ready = false

      let user = this.getUserInfo
      let key, val;
      if(this.getMyEnrolled && this.getMyEnrolled.length > 0){
        
        key = 'elecRef'
        val = this.curRoom.electionId
        await this.latestPosts(key,val).catch(err => console.log(err))
        await this.latestCampaigns(key, val)
          
      }else{
        
        this.ready = true
        this.nodata = true
        
      }
    },
    morePosts(){
      this.loading_more_posts = true

      db.collection('posts').where('elecRef','==', this.curRoom.electionId)
      .orderBy('tstamp','desc').startAfter(this.posts_offset)
      .limit(25).get().then(querySnapshot =>{
        let posts = []
        querySnapshot.forEach(doc => {
          this.posts.push(doc.data())
        });
        // console.log(querySnapshot.docs, this.offset)
        this.posts_offset = querySnapshot.docs[querySnapshot.docs.length-1]
        this.loading_more_posts = false
      })

    },
    latestPosts(key,val){
      return new Promise((resolve,reject)=>{
        
        let docRef = db.collection('posts').where(key,'==',val)
        .orderBy('tstamp','desc').limit(2)
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
          resolve(this.posts)
        }, err=> reject(err))
       
      })
    },
    allElections(user){
      // Elections in user school
      db.collection('elections').where('school','==',user.school)
      .where('public','==',true)
      .get().then(docs=>{
        this.elections = [];
        docs.forEach(doc=>{
          this.elections.push(doc.data())
        })
      })
    },
    latestCampaigns(key, val){
      return new Promise((resolve,reject)=>{
        let myArr = []
        let day = new Date().getTime()  - 24 * 60 * 60 * 1000
        db.collection('campaign_posts').where(key,'==',val)
        .where('tstamp', '>', day)
        // .orderBy("by")
        .onSnapshot(docs=>{
          docs.forEach(doc=>{
            myArr.push(doc.data())
          })
          
          this.campaigns = []
          this.campaigns = myArr
          // console.log(this.campaigns, myArr)
        },(err)=> reject(err))
     
        resolve(myArr)
      })
    },
    async add_reaction(post){
      this.disabled_btns.push(post.docId)
      let me = this.getUser.uid

      this.$helpers.likePost(this.getUser, post)
      .then(data=>{
        this.disabled_btns.splice(this.disabled_btns.indexOf(post.docId),1)
      }).catch(err => console.log(err))


      // try {
      //   console.log(post,reaction)
      //   let a_reaction = post.reactions[reaction]
      //   //console.log(a_reaction)
      //   let me = this.getUser.uid

      //   if(a_reaction.indexOf(me) != -1){ // if current user has reacted in same way before
          
      //     a_reaction.splice(a_reaction.indexOf(me)) // this is reactive, so views are updated immediately
          
          
      //     db.collection('posts').doc(post.id).update({
      //       reactions:post.reactions
      //     })
      //   }
      //   else if(a_reaction.indexOf(me) == -1){ // if current user hasn't reacted same way before
      //     a_reaction.push(this.getUser.uid) // this is reactive, so view are updated immediately
      //     db.collection('posts').doc(post.id).update({
      //       reactions:post.reactions
      //     })
      //     //$('chat_home').scrollTop($('#chat_home')[0].scrollHeight);
      //   }
      //   else{}
  
      // } catch(err) {
      //   console.log(err)
      // }
    },
    isFollowing(user){
      return user.followers.indexOf(this.getUser.uid) == -1 ? false : true
    },
    followUser(event,userId){
      let user = this.extractStudent(userId)
      console.log(event)
      if(this.isFollowing(user)){
        //this.disabled.push(user.uid)
        user.followers.push(this.getUser.uid)

        db.collection('moreUserInfo').doc(user.uid).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayUnion(user.uid)
          })
          
          event.target.innerHTML = 'Following ' + user.name
          //this.disabled.splice(this.disabled.indexOf(user.uid),1)
          //this.$refs[user.uid][0].innerText = `you are following ${user.name}`
          ////console.log(res.data)
          //this.disabled.splice(this.disabled.indexOf(user.uid),1)
          
        })
      }
      else{
        //this.disabled.push(user.uid)
        user.followers.splice(user.followers.indexOf(this.getUser.uid), 1)
        
        //event.target.innerText = `(${user.followers.length - 1})  follow`
        db.collection('moreUserInfo').doc(user.uid).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this.getUser.uid)
        }).then(async res=>{
          await db.collection('moreUserInfo').doc(this.getUser.uid).update({
            following:firebase.firestore.FieldValue.arrayRemove(user.uid)
          })
          event.target.innerHTML = 'Follow ' + user.name
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
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
    this.$eventBus.$on('ShowSnackbar', data=>{
      this.snackbar = data
    })
    this.$eventBus.$on('PushNewPost',data=>{
      // this.posts.unshift(data)
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
        await this.getPosts(this.getUserInfo)
        
        // this.getUserInfo.is_student ? this.allElections(this.getUserInfo) : ''
      
      } else {
        console.log('No user is signed in.')
      }
    });

  }
}
import Navigation from '@/components/Navigation'
import ViewProfile from '@/components/ViewProfile'
import NewPost from '@/components/profile/NewPost'
import NewCampaign from '@/components/profile/NewCampaign'
import ViewCampaign from '@/components/ViewCampaign'
import {mapGetters, mapState} from 'vuex'
import { Picker } from 'emoji-mart-vue'
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
