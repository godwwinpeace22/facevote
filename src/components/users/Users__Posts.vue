<template>
  <div>
    <transition name="fade" mode="out-in">

      <v-loading v-if="!showUi" height="40vh">
        <div class='mx-auto' style="display: table" slot="loading_info">Loading...</div>
      </v-loading>

      <v-row row wrap v-else>
        <v-col cols="12">
          <v-card flat class="grey lighten-4">
            <v-subheader v-if="posts.length == 0">No recent posts</v-subheader>
            <post-template  
              :posts="posts"/>
            
          </v-card>
          
        </v-col>
      </v-row>
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
  props: ['username'],
  watch: {
    'user'(to,from){
      
      this.initialize()
    }
  },
  computed:{
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
      'curProfile'
    ]),
    user(){
      return this.curProfile
    },

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
    async postAuthor(username){
      return await this.$gun.get(username)
      .then()
    },
    async getUserPosts(){
      
      let posts = []
      
      this.$gun.get(this.username)
        .get('posts')
        .map()
        .once(async p => {
          // console.log('posts: => ', p)
          // p.author = await this.postAuthor(p.author['#'])
          posts.push(p)
        })

      
        this.posts = posts.sort((a,b)=> b.tstamp - a.tstamp)
        // console.log(this.posts)
      
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
