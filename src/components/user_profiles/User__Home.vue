<template>
  <div>
    <v-container class="grey lighten-3">
      <v-row>
        <v-col cols="12" md="4" order-sm="2" class="hidden-sm-and-down">
          <v-card height="300" class="font-weight-bold"
            :img="require('@/assets/profile.jpg')"
            outlined :shaped="$vuetify.breakpoint.mdAndUp">
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-row >
            <v-col cols="12" class="pt-0">
              <v-card outlined min-height="300">
                <v-subheader class="font-weight-bold">About</v-subheader>
                
                <v-card-text>
                  {{user.about}}
                </v-card-text>
              </v-card>

            </v-col>
            <v-col cols="12">

              <v-subheader>
                <span class="font-weight-bold">Recent posts </span>

                <v-btn color="primary lighten-2" small 
                  text class="text-capitalize"
                  v-show="posts.length > 0"
                  :to="`${username}/posts`">
                  See All
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-subheader>
              <v-row >
                <v-col>

                  <post-template 
                    :posts="posts"
                    :loading_more_posts="false"
                    :is-last-doc="false"
                    @loadmore="''"
                  />

                </v-col>
                <!-- <v-col cols="12" sm="4" md="3" v-for="post in posts" :key="post.key">
                  <v-card
                    class="mx-auto" flat>
                    
                    <v-img
                      :src="post.imgSrc || require('@/assets/post-bgd.webp')"
                      height="140"
                    ></v-img>

                    <v-card-text>
                      {{$helpers.truncateText(post.body, 60)}}
                    </v-card-text>

                    <v-card-actions>
                      <v-btn text
                        color="deep-purple accent-4">
                        Read
                      </v-btn>
                      
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon>mdi-share</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col> -->
              </v-row>

              <v-subheader>
                <span class="font-weight-bold">Recent events</span>

                <v-btn color="primary lighten-2" small 
                  text class="text-capitalize"
                  :to="`/users/${username}/events`">
                  See All
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-subheader>
              <v-row>
                <v-col cols="12" md="6" v-for="(event,i) in events" :key="event.eventId + i + 'a'">
                  <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                    :to="'/events/' + event.eventId"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <!-- <div class="overline mb-4">OVERLINE</div> -->
                        <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
                        <v-list-item-subtitle>{{event.title}}</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                      ></v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text small class="text-capitalize">55 Going</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-col>
      </v-row>


    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: [],
    events: [],
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
    user(){
      let user = ''
      this.$gun.get(this.username)
        .once(u => {
          user = u
        })

        return user
        // .then()
      // console.log(Promise.resolve(u))
    },
  },
  methods: {
    initialize(){
      this.getUserPosts()
      this.getUserEvents()
    },
    async getUserPosts(){
      
      this.$gun.get(this.username)
        .get('posts')
        .map()
        .once(async (p, key) => {
          // console.log('posts: => ', p)
          p.key = key
          p.author = this.user
          this.posts.find(item => item.key == p.key) ? '' : 
          this.posts.push(p)
        })
      
    },
    getUserEvents(){
      this.$gun.get(this.username)
        .get('events')
        .map().once(async event => {
          if(event.eventId){
            
            event.author = await this.user;
            // console.log(event)
            
            this.events.find(e => e.eventId == event.eventId) ? '' : 
            this.events.push(event)
          }
        })
    },
  },
  mounted(){
    this.initialize()
  },
  components: {
    PostTemplate
  }
}


import { mapState, mapGetters } from "vuex";
import PostTemplate from '@/components/feed/PostTemplate'
</script>
