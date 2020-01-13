<template>
  <div>
    <v-container class="px-0"> 
      <v-row justify="center">
        <v-col cols="12">
          <v-subheader v-if="posts.length == 0">No recent post</v-subheader>
          <post-template :posts="posts" :outlined="false"></post-template>
          
        </v-col>
        <!-- <v-col>
          
        </v-col> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    all_posts: [
      
    ]
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    posts(){
      return this.all_posts.sort((a,b) => a.tstamp - b.tstamp)
    },
    async user(){
      return await this.$gun.get('users').get(this.username)
        .then()
    },
    username(){
      return this.$route.params.username
    },
  },
  methods: {
    initialize(){
      
      this.getUserPosts()
    },
    
    async getUserPosts(){
      
      this.$gun.get('users').get(this.username)
        .get('posts')
        .map()
        .once(async (p, key) => {
          
          let post = Object.assign({}, p)
          post.key = key
          post.author = await this.user

          if(post.imgs){
            let imgs = []
            this.$gun.get(post.imgs['#']).map().once(img => {
              imgs.push(img)
            })
            // console.log({imgs})
            post.imgs = imgs
          }
          else {
            post.imgs = []
          }
          this.all_posts.find(item => item.key == post.key) ? '' : 
          this.all_posts.push(post)
        })
      
    },
  },
  mounted(){
    this.initialize()
  },
  components: {
    PostTemplate,
  }
}

import PostTemplate from '@/components/feed/PostTemplate'
import { mapState, mapGetters } from "vuex";
</script>
