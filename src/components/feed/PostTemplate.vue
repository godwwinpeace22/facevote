<template>
  <div>
    <v-boilerplate
      class="mb-6"
      type="table-heading, list-item-two-line, image, table-tfoot"
    ></v-boilerplate>
    
    <v-card color="" outlined 
      tile elevation="1"
      v-for="(post,i) in uniqPosts" :key="i + '_posts'" 
      class="mb-3 pb-2">
      
      <v-list two-line dense>
        <v-list-item >
          <v-list-item-avatar :color="$helpers.colorMinder(post.author.name.charAt(0))">
            <img :src="post.author.photoURL" v-if="post.author.photoURL">
            <span class="white--text text-capitalize" v-else>{{post.author.name.charAt(0)}}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="primary--text text-capitalize font-weight-bold linkify" style="width:fit-content" 
              @click="$helpers.openProfile($event, post.author)">
              {{post.author.name}}
            </v-list-item-title>
            <v-list-item-subtitle>{{$helpers.parseDate(post.tstamp)}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu offset-y>
              <template v-slot:activator="{on}">
                <v-btn icon dark v-on="on">
                  <v-icon color="grey">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <template v-for="item in postMenu" >
                  <v-list-item @click="postAction(item.action, post)" :key="item.text">
                    <v-list-item-action style="min-width: 32px;">
                      <v-icon >{{item.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                      <v-list-item-subtitle v-show="item.sub">{{item.sub}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
            <span></span>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-text class="px-0 pt-2">
        <div style="white-space: pre-wrap;" class="px-3"
          v-if="readmore.find(id=>id == post.docId)" 
          v-html="$sanitize(post.body)"
          v-linkified:options="linkify_options">
        </div>

        <div v-else style="white-space: pre-wrap;" class="px-3"
          v-html="$helpers.truncateText($sanitize(post.body), 350)"
          v-linkified:options="linkify_options">
        </div>

        <span @click="readmore.push(post.docId)" 
          class="primary--text linkify pl-3" 
          style="text-decoration:none;" 
          v-show="post.body.length > 350 && !readmore.find(id=>id == post.docId)">
          Read more
        </span>

        <!-- POST IMAGES -->
        <image-grid v-if="post.post_type == 'image'" :imgs="post.imgs"/>

        <video-player v-if="post.post_type == 'video'" :video-src="post.videoSrc"/>

      </v-card-text>

      <v-divider class="mx-3"></v-divider>
      <v-card-actions>
        <div style="width:fit-content;" class="text-center">
          
          <v-btn depressed icon 
            class="ml-1" small 
            :disabled="!!disabled_btns.find(id => id == post.docId)" 
            @click.native="add_reaction(post)">
            <v-icon :color="hasLiked(post) ? 'primary' : ''" small>mdi-thumb-up</v-icon>
          </v-btn>
          <span class="">{{post.likes || 0}} Likes</span>
          
          <v-btn icon dark class="ml-3" depressed small
            @click.native="expand(post, i)">
            <v-icon color="primary" small>mdi-comment</v-icon>
          </v-btn>
          <span class="linkify" 
            @click="view_type == 'single_post' ? '' : expand(post, i);">
            {{post.comments_count}} Comments
          </span>

        </div>
      </v-card-actions>

      <!-- COMMENTS -->
      <v-expand-transition>
        <div v-if="expanded.indexOf(i) != -1">
          <v-container class="px-1">
            <v-card flat>
              <v-card-text class="px-2">
                <v-textarea auto-grow color="primary" rows="1" v-model="body[post.docId]"
                  name="comment" outlined @keyup.enter="createComment(post)"
                  label="Add a comment" :ref="post.docId"
                >
                <v-btn icon slot="append-outer" :disabled="!!loading.find(id => id == post.docId)"
                  @click.native="createComment(post)" v-if="body[post.docId] && body[post.docId].trim()">
                  <v-icon color="primary" >mdi-send</v-icon>
                </v-btn>
                <!-- EMOJIS DIALOG-->
                <v-menu max-width="330" :close-on-content-click='false'
                  slot="prepend-inner" max-height="" top offset-y>
                    <template v-slot:activator="{on}">
                      <v-btn v-on="on" icon v-show="body[post.docId]">
                        <v-icon color="success">mdi-emoticon-outline</v-icon>
                      </v-btn>
                    </template>
                  <v-card class="">
                    <emoji-picker @append-emoji="appendEmoji($event, post)"/>
                  </v-card>
                </v-menu>
                </v-textarea>
              </v-card-text>

              <v-divider></v-divider>

              <v-subheader class="font-weight-bold px-2">Comments</v-subheader>
              <v-progress-circular indeterminate color="grey lighten-1" 
                size="20" class="d-block mx-auto" v-if="loading_comments.find(id => id == post.docId)">
              </v-progress-circular>

              <v-subheader v-if="!loading_comments.find(id => id == post.docId) && comments[post.docId] && comments[post.docId].length == 0">No comments</v-subheader>

              <v-card-text class="" v-else>
                <v-container >
                  <v-row>
                    <v-col cols="12" v-for="(comment,i) in comments[post.docId]" :key="'comment' + i">
                      <v-card flat class="grey lighten-3 round">
                        <v-list dense two-line class="grey lighten-3">
                          <v-list-item  
                            @click="$helpers.openProfile($event, comment.author)">

                            <v-list-item-avatar 
                              :color="$helpers.colorMinder(comment.author.name.charAt(0))" 
                              class="white--text">
                              <img :src="comment.author.photoURL" v-if="comment.author.photoURL" alt="alt">
                              <span v-else>{{comment.author.name.charAt(0)}}</span>
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title class="primary--text text-capitalize">
                                {{comment.author.name}}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{$helpers.parseDate(comment.tstamp, true)}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>

                        <v-card-text
                          v-html="comment.body"
                          v-linkified:options="linkify_options">
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
                
              </v-card-text>

              <template v-if="comments[post.docId] && comments[post.docId].length >= 4 && comments[post.docId].length < post.comments">
                <v-btn 
                  color="primary" class="d-block mx-auto" 
                  style="text-transform: initial" 
                  :loading="!!loading_more_comments.find(id => id == post.docId)" 
                  text small @click="moreComments(post)">
                  See more comments
                </v-btn>
              </template>
              <v-divider></v-divider>
            </v-card>
          </v-container>
          
        </div>
      </v-expand-transition>
    </v-card>

    <v-btn 
      v-if="uniqPosts.length >= 15 && !isLastDoc" 
      color="primary" style="text-transform: initial;" 
      :loading="loading_more_posts"
      @click="$emit('loadmore')"
      class="d-block mx-auto" text small >
      See More
    </v-btn>

    <v-row row justify-center>
      <v-dialog v-model="flag_post_dialog" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Report Post</v-card-title>
          <v-card-text class="pt-0">
            <div class="mb-3">Am reporting this post because it contains:</div>
            <!-- <v-select
              v-model.trim="flag_reason"
              :items="flagItems"
              chips outlined
              label="Select reason"
              multiple hide-details
            ></v-select> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="info" text :disabled="flagging" @click.native="flag_post_dialog = false">Cancel</v-btn> -->
            <v-btn color="info" text :loading="flagging" @click.native="hidePost" :disabled="flag_reason.length == 0">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  data: ()=>({
    disabled_btns: [],
    readmore: [],
    body: [],
    loading: [],
    comments: [],
    loading_comments: [],
    loading_more_comments: [],
    post_to_flag: {},
    flagging: false,
    flag_post_dialog: null,
    flag_reason: [],
  }),
  props: {
    posts: {
      type: Array,
      required: true
    },
    posts_offset: {
      default: ''
    },
    loadmore_posts: {
      type: Boolean,
    },
    expanded: {
      type: Array,
      default: function() { return [] }
    },
    loading_more_posts: {
      type: Boolean,
      default: false
    },
    isLastDoc: {
      type: Boolean,
      default: false
    },
    view_type: {
      type: String,
    }
  },
  watch: {
    'posts': function(to, from){
      // console.log(to, this.view_type)
      
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
    ]),
    uniqPosts(){
      
      // latest posts and posts with highest comments on top
      return orderBy(uniqBy(this.posts, 'docId'), ['tstamp', 'comments_count'], ['desc', 'desc'])
    },
    postMenu(){
      return [
        {text: 'Copy post link', action: 'copyLink', icon: 'mdi-link'},
        // {text: 'Share in a post', action: 'sharePost', icon: 'mdi-share'},
        {text: 'Hide this post', action: 'hidePost', icon: 'mdi-flag'}
      ]
    },
    linkify_options(){
      return {
        className: 'linkified',
        events: {
          click: function (e) {
            
          },
          mouseover: function (e) {
           
          }
        },
        ignoreTags: [
          'script',
          'style'
        ],
        format: (value, type) => {
          if (type === 'url' && value.length > 50) {
            value = value.slice(0, 50) + '…';
          }
          return value;
        },
        formatHref: {
          mention: (href) => {
            return location.origin + '/#/home/#@'+ href.substring(1);
          },
          hashtag: (href) => {
            return location.origin + '/#/home/#' + href.substring(1);
          }
        },
        nl2br: true,
      }
    },
    breakpoint(){
      return this.$vuetify.breakpoint
    },
  },
  methods: {
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
    postAction(action, post){
      switch (action) {
        case 'copyLink':
          let text = `${location.origin}/#/posts/${post.docId}`
          this.copyToClipboard(text)
          break;
        case 'sharePost':
          this.sharePost(post)
          break;
        case 'hidePost':
          // this.flag_post_dialog = true;
          this.post_to_flag = post;
          this.hidePost()
          break;
        default:
          break;
      }
    },
    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
          // IE specific code path to prevent textarea being shown while dialog is visible.
          return clipboardData.setData("Text", text); 

      } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {

        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            // console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Post Link copied to clipboard',
              color: 'success'
            })
        }
      }
    },
    hidePost(){
      // save flag report
      this.flagging = true

      this.$gun.get(this.getUser)
        .get('hidden_posts')
        .set(this.post_to_flag.docId)
      
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: "Your won't see this post again",
          color: 'black'
        })

        this.flagging = false

        this.flag_post_dialog = false
      
    },
    appendEmoji(emoji, post){
      let curMsg = this.body[post.docId]
      
      this.body[post.docId] = curMsg ? 
      curMsg + emoji : emoji
      
    },
    async getAuthor(comment){
      console.log({comment})
      return await this.$gun
      .get(comment.author['#']).then()
    },
    createComment(post){
      try {
        
        this.loading.push(post.docId)

        let commentId = this.$uuidv4()
        let user = this.$gun.get(this.getUser.username)

        let postRef = this.$gun.get('elections')
          .get(post.elecRef)
          .get('posts')
          .get(post.docId)

        let comment_data = {
          docId: commentId,
          postRef: post.docId,
          body: this.$sanitize(this.body[post.docId]),
          tstamp: Date.now()
        }


        let comment = postRef
          .get('comments')
          .get(commentId)
          .put(comment_data)
        comment.get('author').put(user)
        
        // comments counter
        let count = (post.comments_count || 0) + 1
        postRef
          .get('comments_count')
          .put(count)

        this.body[post.docId] = ''
        this.loading.splice(this.loading.indexOf(post.docId),1)


      } catch (error) {
        console.log(error)
      }
    },
    moreComments(post){
      // Load more, older comments for a post
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

        // console.log(comments)
        this.loading_more_comments.splice(this.loading_more_comments.indexOf(post.docId),1)
      }).catch(err => {
        // console.log(err)
      })
    },
    async getComments(post){
      
      let postRef = this.$gun.get('elections')
        .get(post.elecRef)
        .get('posts')
        .get(post.docId)


      if(!this.comments[post.docId]){
        this.loading_comments.push(post.docId)
        // get comments for this post
        
        let cmts = []
        postRef.get('comments')
          .map()
          .on(async (data, key) => {
            // console.log({data,key})
            if(data.author){

              data.docId = key
              this.getAuthor(data).then(a => {
                // console.log({a})
                data.author = a
                cmts.push(data)
              })
            }
          })

        // console.log(cmts)

        this.comments = cmts

        this.comments[post.docId] = cmts
        this.loading_comments.splice(this.loading_comments.indexOf(post.docId),1)

      }
      
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
    async add_reaction(post){

      this.disabled_btns.push(post.docId)

      let postRef = this.$gun.get('elections')
        .get(post.elecRef)
        .get('posts')
        .get(post.docId)

      let liked = this.hasLiked(post)

      if(liked){
        // unlike the post
        let newLikes = (post.likes || 0) - 1

        postRef.get('reactions')
          .get(this.getUser.username)
          .put(null);

        postRef.get('likes')
          .put(newLikes)
      }
      else {

        let newLikes = (post.likes || 0) + 1


        postRef.get('reactions')
          .get(this.getUser.username)
          .put(true);

        postRef.get('likes')
          .put(newLikes)
        
      }
      // if(this.getUser.username )
      this.disabled_btns.splice(this.disabled_btns.indexOf(post.docId),1)

    },
    
  },
  async mounted(){
    
    this.view_type == 'single_post' ? this.getComments(this.posts[0]) : ''
    console.log(this.posts)
  },
  components: {
    ImageGrid,
    EmojiPicker,
    VideoPlayer
  }
}
import { mapGetters, mapState } from 'vuex'
import { uniqBy, orderBy } from 'lodash'
// import {firebase, db, database} from '@/plugins/firebase'
import ImageGrid from '@/components/ImageGrid'
import EmojiPicker from '@/components/emojis/EmojiPicker'
import VideoPlayer from '@/components/VideoPlayer'
import * as linkify from 'linkifyjs'
import hashtag from 'linkifyjs/plugins/hashtag'
import mention from 'linkifyjs/plugins/mention'
hashtag(linkify);
mention(linkify)
</script>


<style lang="scss" scoped>

  @mixin borderTopRadius($radius) {
    border-top-right-radius: $radius !important;
    border-top-left-radius: $radius !important;
  }
  .v-dialog--active{
    @include borderTopRadius(0px) 
  }

  .switch_room_dialog.v-dialog--active {
    @include borderTopRadius(0px)
  }
  .v-dialog--fullscreen{
    @include borderTopRadius(0px)
  }
</style>
