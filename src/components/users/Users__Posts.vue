<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <v-layout row wrap v-else>
        <v-flex xs12 sm9>
          <v-card flat class="grey lighten-4">
            <v-subheader v-if="posts.length == 0">No recent posts</v-subheader>
            <post-template  
              :posts="posts" 
              :loading_more_posts="loading_more_posts"
              :is-last-doc="isLastPost" 
              @loadmore="morePosts"/>
            
          </v-card>
          
        </v-flex>
      </v-layout>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUi: false,
    limit_posts: true,
    posts: [],
    posts_offset: '',
    loading: false,
    loading_posts: false,
    isLastPost: false,
    loading_more_posts: false,
  }),
  props: {
    userId: {
      type: String
    },
  },
  watch: {
    'user'(to,from){
      
      this.initialize()
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
      'getUserInfo',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    }
  },
  methods: {
    async morePosts(){
      this.loading_more_posts = true

      let lastPost = this.posts[this.posts.length - 1]

      db.collection('posts').doc(lastPost.docId).get().then(documentSnapshot => {

       db.collection('posts').where('onr.uid','==',this.user.uid)
       .startAfter(documentSnapshot)
       .limit(15).get().then(querySnapshot =>{
         
         querySnapshot.forEach(doc => {
           this.posts.push(doc.data())
         });

         this.isLastPost = querySnapshot.empty
 
         this.posts = this.posts.sort((a,b)=> b.tstamp - a.tstamp)
         
         this.loading_more_posts = false
       }).catch(err => {
         // console.log(err)
       })
     })
      
    },
    async getUserPosts(){
      this.postsRef = db.collection('posts').where('onr.uid','==',this.user.uid)
      .limit(15)
      .onSnapshot(querySnapshot=>{
        let posts = []

        querySnapshot.forEach(doc => {
          posts.push(doc.data())
        });
        this.posts = posts.sort((a,b)=> b.tstamp - a.tstamp)
        //console.log(this.posts)
      }, err=>{
        // console.log(err)
      })
    },
    initialize(){
      
      this.getUserPosts().then(() => {
        this.showUi = true
      })
    }
  },
  mounted(){
    this.user ? this.initialize() : ''
  },
  components: {
    PostTemplate,
  }
  
}
import { mapGetters, mapState } from 'vuex'
import PostTemplate from '@/components/feed/PostTemplate'
import {firebase, db, database} from '@/plugins/firebase'
</script>
