<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm10>
        <v-card flat class="grey lighten-4">
          <v-subheader v-if="posts.length == 0">No recent posts</v-subheader>
          <post-template :posts="posts" :loading_posts="loading_posts" :posts_offset="posts_offset"/>
          
          <v-card-actions class="pl-4" v-if="limit_posts && posts.length >= 6">
            <v-btn color="secondary" class="text-capitalize" flat depressed small :loading="loading" @click="seeMorePosts">See More</v-btn>
          </v-card-actions>
        </v-card>
        
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data: () => ({
    limit_posts: true,
    posts: [],
    posts_offset: '',
    loading: false,
    loading_posts: false,
    offset: 25,
    loading_more_posts: false,
  }),
  props: {
    username: {
      type: String
    },
    user: {
      type: Object,
      required: true
    }
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
    ]),
  },
  methods: {
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
    async getUserPosts(){
      this.postsRef = db.collection('posts').where('onr.uid','==',this.user.uid)
      .limit(25)
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
    initialize(){
      
      this.getUserPosts()
    }
  },
  mounted(){
    this.initialize()
  },
  components: {
    PostTemplate,
  }
  
}
import { mapGetters, mapState } from 'vuex'
import PostTemplate from '@/components/feed/PostTemplate'
import {firebase, db, database} from '@/plugins/firebase'
</script>
