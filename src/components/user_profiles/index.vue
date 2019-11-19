<template>
  <div>
    <vue-headful :title="`${user.name} | ${$appName}`"/>
    <navigation 
      :extension_img=" $vuetify.breakpoint.mdAndUp ? 'https://picsum.photos/1920/1080?random' : require('@/assets/profile.jpg')"
      :prominent="true"
      extension_height="50"
      :color="$helpers.colorMinder(user.name ? user.name.charAt(0) : '')"
    >
      <template v-slot:title>
        
        <span class="text-capitalize">
          {{user.name}}
        </span>
      </template>

      <template v-slot:extension>
        <v-slide-group show-arrows>
          <v-slide-item
            v-for="item in menu_items.filter(itm => itm.show != false)"
            :key="item.text"
            
            v-slot:default="{ active, toggle }"
          >
            <v-btn
              class="mr-1 text-capitalize" text tile
              :input-value="active"
              active-class="purple white--text"
              depressed exact
              :to="item.link"
              @click="toggle"
            >
              {{ item.text }}
            </v-btn>
          </v-slide-item>
        </v-slide-group>
        <v-spacer></v-spacer>
        <v-fab-transition>
          <v-btn
            :key="activeFab.icon"
            :color="activeFab.color"
            fab large dark
            @click="activeFab.action"
            bottom right
            class="mt-10"
          >
            <v-icon>{{ activeFab.icon }}</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>

    </navigation>

    
    <v-container class="px-0 pt-0" v-if="showUi">
      <v-divider></v-divider>

      <v-row no-gutters>
        <v-col>
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
    showUi: false,
    fab: false,
  }),
  watch: {
    'username': function(){
      this.initialize()
    },
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ...mapState([

    ]),
    title(){
      return `${this.user.name} | ${this.$appName}` || 
      `Users | ${this.$appName}`
    },
    currentRoute(){
      
      return this.$route.name
    },
    activeFab () {
      switch (this.currentRoute) {
        case 'user_events': return { color: 'primary', icon: 'mdi-calendar-plus', action: this.newEvent }
        default: return { color: 'success', icon: 'mdi-square-edit-outline', action: this.newPost }
      }
    },
    isSameUser(){
      return this.getUser.username == this.username
    },
    username(){
      return this.$route.params.username
    },
    menu_items(){

      let baseUrl = `/users/${this.username}`
      return [
        {text: 'Home', link: `${baseUrl}`,},
        {text: 'Posts', link: `${baseUrl}/posts`},
        {text: 'Events', link: `${baseUrl}/events`},
        {text: 'Followers', link: `${baseUrl}/followers`},
        {text: 'Following', link: `${baseUrl}/following`},
        {text: 'Manifestos', link: `${baseUrl}/manifestos`},
        {text: 'Stats', link: `${baseUrl}/about`, show: this.isSameUser}
      ]
    },
  },
  methods: {

    initialize(){
      
      this.$gun.get(this.username)
      .on(u => {
        if(u){
          // console.log(u)
          this.user = u
          // this.$store.dispatch('curProfile', u)
          this.showUi = true
        }
        else{
          
          this.$router.push('/notFound')
        }
      })

    },
    newEvent(){
      this.$eventBus.$emit('NewEvent', true)
    },
    newPost(){
      this.$router.push('/home?new=true')
    }
  },
  mounted(){

    this.initialize()
  },
  components: {
    Navigation
  }
}

import { mapState, mapGetters } from "vuex";
import Navigation from "@/components/Navigation";
</script>