<template>
  <div>
    <vue-headful :title="`${user.name} | ${$appName}`"/>

    <navigation/>
    
    <v-container class="grey lighten-3" v-if="showUi">
      <v-row justify="center">
        
        <v-col cols="12" md="8">
          <v-row >
            <v-col cols="12" class="pt-0">
              <v-card outlined min-height="300">
                <v-sheet height="200">
                  <v-img :src="require('@/assets/profile-background.jpg')" height="100%" width="100%"></v-img>
                </v-sheet>

                <v-card flat tile>
                  <div style="position: absolute;top: -110px;">
                    <v-avatar
                        size="177"
                        color="white"
                        class="elevation-1 pt-1 ml-3 d-inline-block"
                      >
                        <v-avatar
                          size="170" class=""
                          color="grey lighten-3"
                        >
                          <img :src="user.photoURL || require('@/assets/profile.jpg')" 
                            alt="profile_pic" v-if="user.photoURL">
                          <span v-else class="display-2">{{user.name ? user.name.charAt(0) : 'u'}}</span>
                        </v-avatar>
                      </v-avatar>

                      <span :class="{online: user.is_online, offline: !user.is_online, online_badge: true}" 
                        style="width: 20px;height:20px;position: absolute;bottom:8%;right:20px;">
                      </span>
                  </div>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info" class="text-capitalize" 
                      depressed
                      v-if="user.username != getUser.username"
                      @click="follow" :disabled="disabled">
                      {{ is_following ? 'Unfollow' : 'Follow' }}
                      <!-- {{user.followers_count}} -->
                    </v-btn>

                    <v-btn color="info" class="text-capitalize" 
                      depressed v-if="user.username == getUser.username"
                      to="/settings" outlined>
                      Edit Profile
                    </v-btn>

                    <v-menu offset-y>
                      <template v-slot:activator="{on}">
                        <v-btn color="primary" class="ml-3" v-on="on" 
                          depressed v-if="user.username == getUser.username"
                        >
                          <v-icon class="mr-1">mdi-plus</v-icon>
                          New
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="$router.push('/home?new=true')">
                          <v-list-item-title>New Post</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$eventBus.$emit('NewEvent', true)">
                          <v-list-item-title>New Event</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                  </v-card-actions>
                </v-card>

                <v-sheet color="transparent" class="">

                  <v-list color="transparent" class="mt-5 pb-0" dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title >
                          <span class="text-capitalize mr-2 font-weight-bold title">{{user.name}}</span>
                          <span>@{{user.username}}</span>
                        </v-list-item-title>
                        <!-- <v-list-item-subtitle></v-list-item-subtitle> -->

                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <div class="d-inline-block">
                    <span class="pl-4" text v-if="user.is_student">{{user.title}}</span>
                    
                    <v-btn 
                      color="info" 
                      class="px-2 ml-2" text 
                    >
                      {{user.followers_count}} followers
                    </v-btn>
                  </div>

                </v-sheet>
                <v-subheader class="font-weight-bold " style="">About</v-subheader>
                
                <v-card-text class="pt-0">
                  {{user.about}}
                </v-card-text>

                <v-slide-group show-arrows class="ml-3 mb-1">
                  <v-slide-item
                    v-for="item in menu_items.filter(itm => itm.show != false)"
                    :key="item.text"
                    
                    v-slot:default="{ active, toggle }"
                  >
                    <v-btn
                      class="mr-1 text-capitalize" text
                      :input-value="active"
                      active-class="primary white--text"
                      depressed exact
                      :to="item.link"
                      @click="toggle"
                    >
                      {{ item.text }}
                    </v-btn>
                  </v-slide-item>
                </v-slide-group>
                <v-divider v-show="$route.name != 'user_posts'"></v-divider>

                <v-card flat tile min-height="200">
                  
                  <router-view></router-view>
                </v-card>
                
              </v-card>

            </v-col>
            
          </v-row>
        </v-col>
        
      </v-row>

      <!-- New Interactive Session -->
      <v-navigation-drawer temporary
        :stateless="drawer_right_persist"
        v-model="drawer_right" right app width="800">

        <new-event 
          @persist-drawer="drawer_right_persist = true" 
          @close-event-drawer="drawer_right = false">
        </new-event>

      </v-navigation-drawer>

    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    posts: [],
    events: [],
    is_following: '',
    disabled: false,
    drawer_right_persist: false,
    drawer_right: false,
    user: {}
  }),
  watch: {
    user(){
      this.getProfile()
    },
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    username(){
      return this.$route.params.username
    },
    
    menu_items(){

      let baseUrl = `/users/${this.username}`
      return [
        {text: 'Posts', link: `${baseUrl}`},
        {text: 'Followers', link: `${baseUrl}/followers`},
        {text: 'Events', link: `${baseUrl}/events`},
      ]
    },
  },
  methods: {
    initialize(){
      this.getUserPosts()
      this.getUserEvents()

      this.$gun.get('users').get(this.username)
        .get('followers')
        .get(this.getUser.username)
        .on(d => {
          console.log({d})
          this.is_following = d ? !!d : false
        })
      
      this.getProfile()
    },
    async getProfile(){
      
      this.user = await this.$gun.get('users')
        .get(this.username)
        .then()
        // console.log(this.user)

      this.showUi = true
    },
    async getUserPosts(){
      
      this.$gun.get('users').get(this.username)
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
      this.$gun.get('users').get(this.username)
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
    async follow(){
      try {

        this.disabled = true
        await this.$helpers.followUser(this.getUser, this.user)

        this.disabled = false
      } catch (error) {
        console.log(error)
        this.disabled = false
      }
    }
  },
  mounted(){
    this.initialize()

    this.$eventBus.$on('NewEvent', data => {
      this.drawer_right = data
    })
  },
  components: {
    PostTemplate,
    NewEvent,
  }
}


import { mapState, mapGetters } from "vuex";
import PostTemplate from '@/components/feed/PostTemplate'
import NewEvent from '@/components/events/NewEvent'
</script>
