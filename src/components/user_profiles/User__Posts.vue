<template>
  <div>
    <v-container class="mt-10"> 
      <v-row justify="center">
        <v-col sm="12" md="6">
          <post-template :posts="posts"></post-template>
          
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
      return await this.$gun.get(this.username)
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
      
      this.$gun.get(this.username)
        .get('posts')
        .map()
        .once(async (p, key) => {
          // console.log('posts: => ', p)
          p.key = key
          p.author = await this.user
          // p.author = await this.postAuthor(p.author['#'])
          this.all_posts.find(item => item.key == p.key) ? '' : 
          this.all_posts.push(p)
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
