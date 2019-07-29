<template>
  <div>
    <v-card v-for="(post,i) in posts" :key="i + '_posts'" class="mb-3 pb-2 elevation-1">
                        
      <v-list two-line dense>
        <v-list-tile avatar>
          <v-list-tile-avatar :color="$helpers.colorMinder(post.onr.name.charAt(0))">
            <img :src="post.onr.photoURL" v-if="post.onr.photoURL">
            <span class="white--text headline" v-else>{{post.onr.name.charAt(0)}}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="secondary--text text-capitalize font-weight-bold linkify" style="width:fit-content" 
              @click="$eventBus.$emit('ViewProfile', post.onr)">
              {{post.onr.name}}
            </v-list-tile-title>
            <v-list-tile-sub-title>{{$helpers.parseDate(post.tstamp ? post.tstamp.toMillis() : Date.now(), true)}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-card-text>
        <span style="white-space: pre-wrap;" 
          v-if="readmore.find(id=>id == post.docId)" 
          v-html="$sanitize(post.body)"
          v-linkified:options="linkify_options">
        </span>

        <span v-else style="white-space: pre-wrap;"
          v-html="$helpers.truncateText($sanitize(post.body), 350)"
          v-linkified:options="linkify_options"></span>
        <span @click="readmore.push(post.docId)" class="secondary--text linkify" 
          style="text-decoration:none;" v-show="post.body.length > 350 && !readmore.find(id=>id == post.docId)">
          Read more
        </span>

        <!-- POST IMAGES -->
        <post-images :post="post"/>

      </v-card-text>

      <v-divider class="mx-3"></v-divider>
      <v-card-actions>
        <div style="width:fit-content;" class="text-xs-center">
          
          <v-btn depressed icon class="ml-1" small :disabled="!!disabled_btns.find(id => id == post.docId)" @click.native="add_reaction(post)">
            <v-icon color="secondary" small>mdi-thumb-up</v-icon>
          </v-btn>
          <span class="">{{post.reactions}} Likes</span>

          <v-btn icon dark class="ml-3" depressed small
            @click.native="expand(post, i)">
            <v-icon color="secondary" small>mdi-comment</v-icon>
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
                  name="comment" outline @keyup.enter="submitComment(post)"
                  label="Add a comment" :ref="post.docId"
                >
                <v-btn icon slot="append-outer" :disabled="!!loading.find(id => id == post.docId)"
                  @click.native="submitComment(post)" v-if="body[post.docId] && body[post.docId].trim()">
                  <v-icon color="secondary" >mdi-send</v-icon>
                </v-btn>
                <!-- EMOJIS DIALOG-->
                <v-menu max-width="330" :close-on-content-click='false'
                  slot="prepend-inner" max-height="" top offset-y>

                  <v-btn slot="activator" icon v-show="body[post.docId]">
                    <v-icon color="success">mdi-emoticon-outline</v-icon>
                  </v-btn>
                  <v-card class="">
                    <emoji-picker @append-emoji="appendEmoji($event, post)"/>
                  </v-card>
                </v-menu>
                </v-textarea>
              </v-card-text>

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
                              <v-list-tile-title class="secondary--text text-capitalize">
                                {{comment.onr.name}}
                              </v-list-tile-title>
                              <v-list-tile-sub-title>{{$helpers.parseDate(comment.tstamp ? comment.tstamp.toMillis() : Date.now(),true)}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>

                        <v-card-text
                          v-html="comment.body"
                          v-linkified:options="linkify_options">
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
              <v-divider></v-divider>
            </v-card>
          </v-container>
          
        </div>
      </v-expand-transition>
    </v-card>

    <v-btn v-if="posts.length >= 25" color="secondary" style="text-transform: initial;" :loading="loading_more_posts"
      @click="$emit('loadmore')" class="d-block mx-auto" flat small >
      See More
    </v-btn>
  </div>
</template>
<script>
export default {
  data: ()=>({
    expanded: [],
    disabled_btns: [],
    readmore: [],
    body: [],
    loading: [],
    comments: [],
    loading_comments: [],
    loading_more_comments: [],
  }),
  props: ['posts','posts_offset', 'loading_more_posts'],
  watch: {
    
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
    appendEmoji(emoji, post){
      let curMsg = this.body[post.docId]
      
      this.body[post.docId] = curMsg ? 
      curMsg + emoji : emoji
      
    },
    async submitComment(post){
      let docId = post.docId
      this.loading.push(docId)
      let postRef = db.collection('posts').doc(docId)
      let commentRef = db.collection('comments').doc()

      let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo
      let onr = {
          name,
          photoURL,
          email,
          sch,
          fac,
          dept,
          uid,
          is_student
        }

        // Create a batch operation
        let batch = db.batch();

        batch.set(commentRef, {
          onr: onr,
          postRef: docId,
          body: this.$sanitize(this.body[docId]),
          tstamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        batch.update(postRef, {
          comments: firebase.firestore.FieldValue.increment(1)
        })

        batch.commit().then(()=>{
          this.body[docId] = ''
          this.loading.splice(this.loading.indexOf(docId),1)
        })
      
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
      
      if(!this.comments[post.docId]){
        this.loading_comments.push(post.docId)
        // get comments for this post

        return db.collection('comments')
          .where('postRef', '==', post.docId)
          .orderBy('tstamp', 'desc').limit(25)
          .onSnapshot(querySnapshot =>{
            let comments = []
            querySnapshot.forEach(doc =>{
              comments.push(doc.data())
            })
            this.offset = querySnapshot.docs[querySnapshot.docs.length-1]

            this.comments[post.docId] = comments
            this.loading_comments.splice(this.loading_comments.indexOf(post.docId),1)
            
            return comments

          }, err => {
            // console.log(err)
          })
      }
      
    },
    async add_reaction(post){
      this.disabled_btns.push(post.docId)
      let me = this.getUser.uid

      this.$helpers.likePost(this.getUser, post)
      .then(data=>{
        this.disabled_btns.splice(this.disabled_btns.indexOf(post.docId),1)
      }).catch(err => {
        // console.log(err)
      })
    },
  },
  async mounted(){
    
  },
  components: {
    PostImages,
    EmojiPicker,
  }
}
import { mapGetters, mapState } from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
import PostImages from '@/components/feed/PostImages'
import EmojiPicker from '@/components/EmojiPicker'
import * as linkify from 'linkifyjs';;
import hashtag from 'linkifyjs/plugins/hashtag';
import mention from 'linkifyjs/plugins/mention';
hashtag(linkify);
mention(linkify)
</script>
